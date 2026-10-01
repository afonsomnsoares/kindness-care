import { act } from 'react';
import { renderToString } from 'react-dom/server';
import { hydrateRoot } from 'react-dom/client';
import { render, screen } from '@testing-library/react';
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
