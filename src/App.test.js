import { render, screen } from '@testing-library/react';
// Efeito colateral: inicializa o i18next, tal como src/index.js faz na app
// real. Sem isto, t() devolve as chaves em bruto (ex.: "notFound.heading")
// em vez do texto traduzido.
import i18n from './i18n/i18n';
import App from './App';

// Testes de fumo (smoke tests): garantem que a app monta sem rebentar e que
// o router troca de página corretamente. Não testam estilo/layout, só que
// nada está partido a nível estrutural.
//
// Nota: fixamos o idioma explicitamente em vez de confiar na deteção
// automática (path/localStorage/navigator) porque, no ambiente de testes,
// o "navigator.language" do jsdom não corresponde necessariamente ao
// idioma implícito na rota - o mesmo tipo de inconsistência que a app
// real pode mostrar a um utilizador com o browser em inglês a navegar
// para uma rota em português (ver i18n.changeLanguage só é chamado no
// seletor de idioma, nunca ao navegar por <Link>).
function renderAt(path, lang = 'pt') {
  i18n.changeLanguage(lang);
  window.history.pushState({}, '', path);
  return render(<App />);
}

afterEach(() => {
  window.history.pushState({}, '', '/');
});

test('renderiza a página inicial sem rebentar', async () => {
  renderAt('/');

  // O telefone aparece em mais do que um sítio na Home (TopBar + secção de
  // contacto), por isso confirmamos apenas que existe pelo menos uma vez -
  // o objetivo aqui é só garantir que a página monta sem rebentar.
  expect((await screen.findAllByText('+351 968 844 420')).length).toBeGreaterThan(0);
});

test('navega para uma rota conhecida em inglês (/en/contacts)', async () => {
  renderAt('/en/contacts', 'en');

  expect(await screen.findByText('Send Us a Message')).toBeInTheDocument();
});

test('mostra a página 404 para uma rota desconhecida', async () => {
  renderAt('/esta-rota-nao-existe');

  expect(await screen.findByText('404')).toBeInTheDocument();
});
