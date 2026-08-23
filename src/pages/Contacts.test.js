import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { ToastProvider } from '../components/Toast';
// Inicializa o i18next e fixa o idioma em PT (ver nota em App.test.js).
import i18n from '../i18n/i18n';
import Contacts from './Contacts';

i18n.changeLanguage('pt');

// Testes de fumo (smoke tests) para o formulário de contacto:
// - validação HTML5 dos campos obrigatórios bloqueia o envio;
// - um envio válido chama o FormSubmit com os dados certos.
// Não testa a integração real com formsubmit.co, só o comportamento do form.

function renderContacts() {
  return render(
    <MemoryRouter>
      <HelmetProvider>
        <ToastProvider>
          <Contacts />
        </ToastProvider>
      </HelmetProvider>
    </MemoryRouter>
  );
}

beforeEach(() => {
  global.fetch = jest.fn(() =>
    Promise.resolve({ json: () => Promise.resolve({ success: true }) })
  );
});

afterEach(() => {
  jest.restoreAllMocks();
});

test('não envia o formulário se os campos obrigatórios estiverem vazios', async () => {
  renderContacts();

  await userEvent.click(screen.getByRole('button', { name: /enviar mensagem/i }));

  expect(global.fetch).not.toHaveBeenCalled();
});

test('envia o formulário para o FormSubmit quando os campos obrigatórios estão preenchidos', async () => {
  // O anti-spam time-trap exige >= 3000ms entre a montagem e o envio
  // (ver src/hooks/useAntiSpam.js). Controlamos o tempo via Date.now
  // em vez de esperar 3s reais ou usar fake timers (que colidem com
  // os timers internos do userEvent).
  let now = 1_700_000_000_000;
  jest.spyOn(Date, 'now').mockImplementation(() => now);

  renderContacts();

  await userEvent.type(screen.getByLabelText(/nome completo/i), 'Maria Silva');
  await userEvent.type(screen.getByLabelText(/^email/i), 'maria@example.com');
  await userEvent.selectOptions(screen.getByLabelText(/assunto/i), 'enfermagem');
  await userEvent.type(screen.getByLabelText(/mensagem/i), 'Gostaria de mais informações.');

  now += 3100;
  fireEvent.click(screen.getByRole('button', { name: /enviar mensagem/i }));

  await waitFor(() => expect(global.fetch).toHaveBeenCalledTimes(1));

  const [url, options] = global.fetch.mock.calls[0];
  expect(url).toBe('https://formsubmit.co/ajax/geral@kindnesscare.pt');
  const body = JSON.parse(options.body);
  expect(body).toMatchObject({
    nome: 'Maria Silva',
    email: 'maria@example.com',
    assunto: 'enfermagem',
    mensagem: 'Gostaria de mais informações.',
  });
});

test('não envia o formulário se o campo honeypot estiver preenchido (bot)', async () => {
  let now = 1_700_000_000_000;
  jest.spyOn(Date, 'now').mockImplementation(() => now);

  renderContacts();

  await userEvent.type(screen.getByLabelText(/nome completo/i), 'Bot Falso');
  await userEvent.type(screen.getByLabelText(/^email/i), 'bot@example.com');
  await userEvent.selectOptions(screen.getByLabelText(/assunto/i), 'outro');
  await userEvent.type(screen.getByLabelText(/mensagem/i), 'mensagem automática');

  // O honeypot está escondido de utilizadores reais (CSS) mas continua
  // acessível a bots que preenchem todos os inputs do formulário.
  fireEvent.change(screen.getByLabelText(/não preencha este campo/i), {
    target: { value: 'preenchido-por-um-bot' },
  });

  now += 3100;
  fireEvent.click(screen.getByRole('button', { name: /enviar mensagem/i }));

  await waitFor(() =>
    expect(screen.getByRole('button', { name: /enviar mensagem/i })).toBeEnabled()
  );
  expect(global.fetch).not.toHaveBeenCalled();
});
