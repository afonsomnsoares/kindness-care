// @vitest-environment node
// (Os componentes .astro só são renderizados em Node; o DOM é criado com o jsdom.)
import { readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { JSDOM } from 'jsdom';
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { loadRenderers } from 'astro:container';
import { getContainerRenderer } from '@astrojs/react/container-renderer';
import Page from './pages/[...path].astro';
import NotFoundPT from './pages/404.astro';
import NotFoundEN from './pages/en/404.astro';
import routes from './i18n/routes';
import { getT } from './i18n/i18n';
import { absoluteUrl } from './lib/site';
import { initNavigation } from './scripts/navigation';
import { initCookieConsent } from './scripts/cookie-consent';
import { openConsentSettings } from './lib/consent';

// Testes das páginas geradas: cada rota de src/i18n/routes.js é renderizada
// tal como no build (Astro Container API) e verificada no HTML resultante.

let container;
beforeAll(async () => {
  container = await AstroContainer.create({
    renderers: await loadRenderers([getContainerRenderer()]),
  });
});

async function renderHtml(lang, page) {
  return container.renderToString(Page, {
    props: { lang, page },
    request: new Request(absoluteUrl(routes[lang][page])),
  });
}

async function render(lang, page) {
  return new JSDOM(await renderHtml(lang, page)).window.document;
}

const allPages = Object.entries(routes).flatMap(([lang, langRoutes]) =>
  Object.keys(langRoutes).map((page) => [lang, page, langRoutes[page]])
);

describe.each(allPages)('%s %s (%s)', (lang, page) => {
  let doc;
  beforeAll(async () => {
    doc = await render(lang, page);
  });

  test('tem o idioma, o título e o endereço canónico certos', () => {
    const t = getT(lang);
    expect(doc.documentElement.lang).toBe(lang);
    expect(doc.title).toBe(`${t(`meta.${page}.title`)} | Kindness & Care`);
    expect(doc.querySelector('link[rel=canonical]').getAttribute('href')).toBe(absoluteUrl(routes[lang][page]));
    expect(doc.querySelector('meta[name=description]').content).toBe(t(`meta.${page}.description`));
    expect(doc.querySelectorAll('h1')).toHaveLength(1);
  });

  test('não usa atributos style (a Content Security Policy bloqueia-os)', () => {
    expect([...doc.querySelectorAll('[style]')].map((el) => el.outerHTML.slice(0, 80))).toEqual([]);
  });

  test('a escolha de idioma aponta para a mesma página nos dois idiomas', () => {
    const languageLinks = [...doc.querySelectorAll('#dropdown-language a')];
    expect(languageLinks.map((a) => a.getAttribute('href'))).toEqual([
      routes.pt[page],
      routes.en[page],
    ]);
  });

  test('o texto da interface está todo no idioma da página', () => {
    const text = doc.body.textContent;
    const other = getT(lang === 'pt' ? 'en' : 'pt');
    for (const key of ['nav.language', 'footer.cookieSettings', 'cookies.message', 'footer.rights']) {
      expect(text).not.toContain(other(key));
      expect(text).toContain(getT(lang)(key));
    }
  });
});

test('o item do menu da página atual fica destacado (também na página inicial em inglês)', async () => {
  for (const [lang, page] of [['pt', 'home'], ['en', 'home'], ['pt', 'history'], ['en', 'contacts']]) {
    const doc = await render(lang, page);
    const active = [...doc.querySelectorAll('.nav-menu .nav-item.active a')];
    expect(active.map((a) => a.getAttribute('href'))).toEqual([routes[lang][page]]);
  }
});

test('numa página de um submenu, o submenu e a página ficam destacados', async () => {
  for (const [lang, page, submenu] of [['pt', 'nursing', 'services'], ['en', 'mission', 'kindness-care']]) {
    const doc = await render(lang, page);
    const activeItems = [...doc.querySelectorAll('.nav-menu > .nav-item.active')];
    expect(activeItems.map((li) => li.querySelector('[aria-controls]')?.getAttribute('aria-controls')))
      .toEqual([`dropdown-${submenu}`]);
    for (const menu of ['.nav-menu', '#mobile-menu']) {
      const current = [...doc.querySelectorAll(`${menu} [aria-current=page]`)];
      expect(current.map((a) => a.getAttribute('href'))).toEqual([routes[lang][page]]);
      expect(current[0].classList.contains('active')).toBe(true);
    }
  }
});

test.each([['pt', NotFoundPT,'Página Não Encontrada'], ['en', NotFoundEN, 'Page Not Found']])(
  'página 404 em %s: no idioma certo e sem indexação',
  async (lang, Component, heading) => {
    const html = await container.renderToString(Component, {
      request: new Request(absoluteUrl(lang === 'en' ? '/en/404' : '/404')),
    });
    const doc = new JSDOM(html).window.document;
    expect(doc.documentElement.lang).toBe(lang);
    expect(doc.querySelector('h2').textContent.trim()).toBe(heading);
    expect(doc.querySelector('meta[name=robots]').content).toBe('noindex');
    expect(doc.querySelector('link[rel=canonical]')).toBeNull();
  }
);

describe('scripts da página', () => {
  // Abre o HTML de uma página gerada num browser simulado (jsdom), com
  // window/document globais, como os scripts esperam encontrar.
  const GLOBALS = ['window', 'document', 'localStorage', 'HTMLElement', 'Event', 'KeyboardEvent', 'MouseEvent'];
  async function mount(lang, page) {
    const { window } = new JSDOM(await renderHtml(lang, page), {
      url: absoluteUrl(routes[lang][page]),
      pretendToBeVisual: true,
    });
    for (const name of GLOBALS) vi.stubGlobal(name, window[name]);
  }

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.useRealTimers();
  });

  test('menu: um submenu de cada vez, fecha com Escape e com clique fora', async () => {
    await mount('pt', 'history');
    initNavigation();
    const services = document.querySelector('[aria-controls="dropdown-services"]');
    const language = document.querySelector('[aria-controls="dropdown-language"]');
    const submenu = (id) => document.getElementById(`dropdown-${id}`);

    services.click();
    expect(submenu('services').hidden).toBe(false);
    expect(services.getAttribute('aria-expanded')).toBe('true');

    language.click();
    expect(submenu('services').hidden).toBe(true);
    expect(submenu('language').hidden).toBe(false);

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    expect(submenu('language').hidden).toBe(true);
    expect(document.activeElement).toBe(language);

    services.click();
    document.body.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
    expect(submenu('services').hidden).toBe(true);
  });

  test('menu mobile: abre como diálogo e fecha com Escape, devolvendo o foco', async () => {
    await mount('en', 'contacts');
    initNavigation();
    const toggle = document.querySelector('[data-mobile-toggle]');
    const overlay = document.querySelector('[data-mobile-overlay]');

    toggle.focus();
    toggle.click();
    expect(overlay.hidden).toBe(false);
    expect(toggle.getAttribute('aria-expanded')).toBe('true');
    expect(toggle.getAttribute('aria-label')).toBe('Close menu');

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    expect(overlay.hidden).toBe(true);
    expect(toggle.getAttribute('aria-label')).toBe('Open menu');
    expect(document.activeElement).toBe(toggle);
  });

  test('cookies: o aviso aparece, guarda a escolha e pode ser reaberto', async () => {
    vi.useFakeTimers();
    await mount('pt', 'home');
    initCookieConsent();
    const banner = document.querySelector('[data-cookie-banner]');

    expect(banner.hidden).toBe(true);
    vi.advanceTimersByTime(1000);
    expect(banner.hidden).toBe(false);

    banner.querySelector('[data-cookie-reject]').click();
    expect(banner.hidden).toBe(true);
    expect(localStorage.getItem('cookieConsent')).toBe('rejected');

    openConsentSettings();
    expect(banner.hidden).toBe(false);
  });

  test('cookies: não aparece se o visitante já escolheu', async () => {
    vi.useFakeTimers();
    await mount('en', 'home');
    localStorage.setItem('cookieConsent', 'accepted');
    initCookieConsent();

    vi.advanceTimersByTime(5000);
    expect(document.querySelector('[data-cookie-banner]').hidden).toBe(true);
  });
});

// O CSS de cada página só é carregado nessa página. Se duas folhas de estilo
// definirem a mesma classe, o aspeto passa a depender da ordem em que o CSS é
// carregado. As classes partilhadas ficam em src/styles/App.css (ver README,
// "Estilos").
test('nenhuma classe CSS é definida em mais do que um ficheiro', () => {
  // Lidos do disco: o Vitest não processa CSS, e os imports devolvem "".
  const srcDir = path.resolve('src');
  const stylesheets = readdirSync(srcDir, { recursive: true }).filter((f) =>
    f.endsWith('.css')
  );
  expect(stylesheets.length).toBeGreaterThan(10);

  const definedIn = {};
  for (const file of stylesheets) {
    const css = readFileSync(path.join(srcDir, file), 'utf8');
    const withoutComments = css.replace(/\/\*[\s\S]*?\*\//g, '');
    for (const [, cls] of withoutComments.matchAll(/^\s*\.([\w-]+)/gm)) {
      (definedIn[cls] ??= new Set()).add(file);
    }
  }

  const duplicated = Object.entries(definedIn)
    .filter(([, files]) => files.size > 1)
    .map(([cls, files]) => `.${cls}: ${[...files].join(', ')}`);
  expect(duplicated).toEqual([]);
});
