import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import routes from '../../i18n/routes';
import { pickMessages } from '../../i18n/i18n';
import ContactForm from './ContactForm';

// Testes de fumo (smoke tests) para o formulário de contacto:
// - validação HTML5 dos campos obrigatórios (e do consentimento) bloqueia o envio;
// - um envio válido chama o FormSubmit com os dados certos;
// - os textos aparecem no idioma da página.
// Não testa a integração real com formsubmit.co, só o comportamento do form.

function renderContacts(lang = 'pt') {
  return render(
    <ContactForm
      messages={pickMessages(lang, ['contacts.form', 'forms', 'common'])}
      privacyPath={routes[lang].privacy}
    />
  );
}

beforeEach(() => {
  // Resposta do FormSubmit a um envio bem-sucedido (success em texto).
  global.fetch = vi.fn(() =>
    Promise.resolve({ ok: true, json: () => Promise.resolve({ success: 'true' }) })
  );
});

afterEach(() => {
  vi.restoreAllMocks();
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
  vi.spyOn(Date, 'now').mockImplementation(() => now);

  renderContacts();

  await userEvent.type(screen.getByLabelText(/nome completo/i), 'Maria Silva');
  await userEvent.type(screen.getByLabelText(/^email/i), 'maria@example.com');
  await userEvent.selectOptions(screen.getByLabelText(/assunto/i), 'enfermagem');
  await userEvent.type(screen.getByLabelText(/mensagem/i), 'Gostaria de mais informações.');
  await userEvent.click(screen.getByRole('checkbox', { name: /política de privacidade/i }));

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

test('não envia o formulário sem o consentimento para o tratamento dos dados', async () => {
  let now = 1_700_000_000_000;
  vi.spyOn(Date, 'now').mockImplementation(() => now);

  renderContacts();

  await userEvent.type(screen.getByLabelText(/nome completo/i), 'Maria Silva');
  await userEvent.type(screen.getByLabelText(/^email/i), 'maria@example.com');
  await userEvent.selectOptions(screen.getByLabelText(/assunto/i), 'enfermagem');
  await userEvent.type(screen.getByLabelText(/mensagem/i), 'Gostaria de mais informações.');

  now += 3100;
  await userEvent.click(screen.getByRole('button', { name: /enviar mensagem/i }));

  expect(global.fetch).not.toHaveBeenCalled();
});

test('mostra o formulário em inglês na página em inglês', () => {
  renderContacts('en');

  expect(screen.getByLabelText(/full name/i)).toHaveAttribute('placeholder', 'Your full name');
  expect(screen.getByRole('option', { name: 'Select a subject' })).toBeInTheDocument();
  expect(screen.getByRole('checkbox', { name: /privacy policy/i })).toBeInTheDocument();
  expect(screen.queryByText(/nome completo/i)).not.toBeInTheDocument();
});

test('não envia o formulário se o campo honeypot estiver preenchido (bot)', async () => {
  let now = 1_700_000_000_000;
  vi.spyOn(Date, 'now').mockImplementation(() => now);

  renderContacts();

  await userEvent.type(screen.getByLabelText(/nome completo/i), 'Bot Falso');
  await userEvent.type(screen.getByLabelText(/^email/i), 'bot@example.com');
  await userEvent.selectOptions(screen.getByLabelText(/assunto/i), 'outro');
  await userEvent.type(screen.getByLabelText(/mensagem/i), 'mensagem automática');
  await userEvent.click(screen.getByRole('checkbox', { name: /política de privacidade/i }));

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

test('mostra erro (e não sucesso) quando o FormSubmit responde success: "false"', async () => {
  // Ex.: formulário ainda não ativado no FormSubmit.
  global.fetch = vi.fn(() =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve({ success: 'false', message: 'This form needs Activation.' }),
    })
  );
  let now = 1_700_000_000_000;
  vi.spyOn(Date, 'now').mockImplementation(() => now);

  renderContacts();

  await userEvent.type(screen.getByLabelText(/nome completo/i), 'Maria Silva');
  await userEvent.type(screen.getByLabelText(/^email/i), 'maria@example.com');
  await userEvent.selectOptions(screen.getByLabelText(/assunto/i), 'enfermagem');
  await userEvent.type(screen.getByLabelText(/mensagem/i), 'Gostaria de mais informações.');
  await userEvent.click(screen.getByRole('checkbox', { name: /política de privacidade/i }));

  now += 3100;
  fireEvent.click(screen.getByRole('button', { name: /enviar mensagem/i }));

  expect(await screen.findByText(/erro ao enviar a mensagem/i)).toBeInTheDocument();
  expect(screen.queryByText(/enviada com sucesso/i)).not.toBeInTheDocument();
  // Os dados ficam no formulário, para a pessoa tentar outra vez.
  expect(screen.getByLabelText(/nome completo/i)).toHaveValue('Maria Silva');
});
