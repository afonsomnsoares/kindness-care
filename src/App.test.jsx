import { readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { act } from 'react';
import { renderToString } from 'react-dom/server';
import { hydrateRoot } from 'react-dom/client';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createMemoryRouter, RouterProvider } from 'react-router';
import paths from './i18n/routes';
import App from './root';
import routeConfig from './routes';

// Testes de fumo (smoke tests): garantem que a app monta sem rebentar e que
// o router troca de página corretamente. Não testam estilo/layout, só que
// nada está partido a nível estrutural.
//
// O router é construído a partir da configuração real (src/routes.js), com
// cada ficheiro de rota resolvido para o seu componente.
const modules = import.meta.glob(
  ['./pages/*.jsx', './components/ServicePage.jsx', '!./**/*.test.jsx'],
  { eager: true }
);

function appAt(path) {
  const children = routeConfig.map(({ id, path: routePath, file }) => ({
    id,
    path: routePath,
    Component: modules[`./${file}`].default,
  }));
  const router = createMemoryRouter([{ path: '/', Component: App, children }], {
    initialEntries: [path],
  });
  return <RouterProvider router={router} />;
}

function renderAt(path) {
  return render(appAt(path));
}

test('renderiza a página inicial sem rebentar', async () => {
  renderAt('/');

  // O telefone aparece em mais do que um sítio na Home (TopBar + secção de
  // contacto), por isso confirmamos apenas que existe pelo menos uma vez -
  // o objetivo aqui é só garantir que a página monta sem rebentar.
  expect((await screen.findAllByText('+351 968 844 420')).length).toBeGreaterThan(0);
});

test('navega para uma rota conhecida em inglês (/en/contacts)', async () => {
  renderAt('/en/contacts');

  expect(await screen.findByText('Send Us a Message')).toBeInTheDocument();
});

test('renderiza as páginas de serviço partilhadas (ServicePage) em PT e EN', async () => {
  const { unmount } = renderAt('/assistencia-medica');
  expect(
    await screen.findByRole('heading', { level: 1, name: 'Assistência Médica' })
  ).toBeInTheDocument();
  unmount();

  renderAt('/en/home-care');
  expect(
    await screen.findByRole('heading', { level: 1, name: 'Home Care' })
  ).toBeInTheDocument();
});

test('o idioma vem do URL e não do browser', async () => {
  renderAt('/en/history');

  expect(await screen.findByRole('link', { name: 'Contacts' })).toBeInTheDocument();
});

test('mostra a página 404 para uma rota desconhecida', async () => {
  renderAt('/esta-rota-nao-existe');

  expect(await screen.findByText('404')).toBeInTheDocument();
});

// O build pré-renderiza cada página para HTML e o browser depois "hidrata"
// esse HTML. Se o primeiro render no browser for diferente do HTML do build
// (ex.: algo que depende de localStorage ou do idioma do browser), o React
// deita fora o HTML e volta a desenhar a página. Este teste apanha isso.
test.each(Object.values(paths).flatMap((langRoutes) => Object.values(langRoutes)))(
  'a página %s hidrata sem diferenças face ao HTML pré-renderizado',
  async (path) => {
    const container = document.createElement('div');
    container.innerHTML = renderToString(appAt(path));
    document.body.appendChild(container);

    const errors = [];
    let root;
    await act(async () => {
      root = hydrateRoot(container, appAt(path), {
        onRecoverableError: (error) => errors.push(error),
      });
    });

    expect(errors).toEqual([]);
    act(() => root.unmount());
    container.remove();
  }
);

function routerAt(path) {
  const children = routeConfig.map(({ id, path: routePath, file }) => ({
    id,
    path: routePath,
    Component: modules[`./${file}`].default,
  }));
  return createMemoryRouter([{ path: '/', Component: App, children }], {
    initialEntries: [path],
  });
}

test('mudar de idioma abre a mesma página no outro idioma', async () => {
  const router = routerAt('/historia');
  render(<RouterProvider router={router} />);

  await userEvent.click(await screen.findByRole('button', { name: 'IDIOMA' }));
  await userEvent.click(screen.getByRole('button', { name: 'Inglês' }));

  expect(router.state.location.pathname).toBe('/en/history');
  expect(await screen.findByRole('link', { name: 'Contacts' })).toBeInTheDocument();
});

describe('aviso de cookies', () => {
  beforeEach(() => localStorage.clear());

  test('guarda a escolha e pode ser reaberto no rodapé', async () => {
    renderAt('/');

    const banner = await screen.findByRole('dialog', { name: 'Consentimento de cookies' }, { timeout: 2000 });
    await userEvent.click(within(banner).getByRole('button', { name: 'Recusar' }));

    expect(localStorage.getItem('cookieConsent')).toBe('rejected');
    expect(screen.queryByRole('dialog', { name: 'Consentimento de cookies' })).not.toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: 'Definições de cookies' }));
    expect(screen.getByRole('dialog', { name: 'Consentimento de cookies' })).toBeInTheDocument();
  });

  test('não volta a aparecer depois de o visitante escolher', async () => {
    localStorage.setItem('cookieConsent', 'accepted');
    renderAt('/');

    await screen.findAllByText('+351 968 844 420');
    await new Promise((resolve) => setTimeout(resolve, 1100));
    expect(screen.queryByRole('dialog', { name: 'Consentimento de cookies' })).not.toBeInTheDocument();
  });
});

// O CSS de cada página só é carregado quando a página é visitada. Se duas
// folhas de estilo definirem a mesma classe, o aspeto passa a depender da
// ordem em que o visitante abriu as páginas. As classes partilhadas ficam em
// App.css (ver README, "Estilos").
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
