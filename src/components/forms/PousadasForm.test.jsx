import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import routes from '../../i18n/routes';
import { pickMessages } from '../../i18n/i18n';
import PousadasForm, { COUNTRIES, flagUrl } from './PousadasForm';

// Testes de fumo (smoke tests) para o formulário Pousadas de Portugal:
// indicativo do país, datas da estadia e envio para o FormSubmit.

function renderPousadas(lang = 'pt') {
  return render(
    <PousadasForm
      lang={lang}
      messages={pickMessages(lang, ['healthTourism.form', 'forms', 'common'])}
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

test('envia o pedido com o indicativo do país escolhido', async () => {
  // Ver o comentário sobre o time-trap em ContactForm.test.jsx.
  let now = 1_700_000_000_000;
  vi.spyOn(Date, 'now').mockImplementation(() => now);

  renderPousadas();

  await userEvent.type(screen.getByLabelText(/^nome/i), 'John Smith');
  await userEvent.type(screen.getByLabelText(/morada/i), '1 High Street, London');
  await userEvent.selectOptions(
    screen.getByRole('combobox', { name: /país do indicativo/i }),
    'GB'
  );
  expect(screen.getByLabelText(/contacto telefónico/i)).toHaveValue('+44 ');
  await userEvent.type(screen.getByLabelText(/contacto telefónico/i), '7700 900123');
  await userEvent.type(screen.getByLabelText(/^email/i), 'john@example.com');
  await userEvent.selectOptions(screen.getByLabelText(/pousada onde/i), 'Pousada do Gerês');
  fireEvent.change(screen.getByLabelText(/check-in/i), { target: { value: '2099-06-01' } });
  fireEvent.change(screen.getByLabelText(/check-out/i), { target: { value: '2099-06-05' } });
  await userEvent.type(screen.getByLabelText(/serviço solicitado/i), 'Enfermagem');
  await userEvent.click(screen.getByRole('checkbox', { name: /política de privacidade/i }));

  now += 3100;
  fireEvent.click(screen.getByRole('button', { name: /enviar pedido/i }));

  await waitFor(() => expect(global.fetch).toHaveBeenCalledTimes(1));
  expect(JSON.parse(global.fetch.mock.calls[0][1].body)).toMatchObject({
    nome: 'John Smith',
    pais: 'GB',
    contacto: '+44 7700 900123',
    pousada: 'Pousada do Gerês',
    check_in: '2099-06-01',
    check_out: '2099-06-05',
  });
  // Preenche o formulário inteiro tecla a tecla, e cada tecla volta a desenhar
  // a lista de 157 países: no jsdom demora ~3 s, perto do limite de 5 s.
}, 15000);

test('o check-out não pode ser antes do check-in', () => {
  renderPousadas();

  fireEvent.change(screen.getByLabelText(/check-in/i), { target: { value: '2099-06-01' } });

  expect(screen.getByLabelText(/check-out/i)).toHaveAttribute('min', '2099-06-01');
});

test('na página em inglês, os textos e os nomes dos países estão em inglês', () => {
  renderPousadas('en');

  expect(screen.getByLabelText(/phone number/i)).toBeInTheDocument();
  expect(screen.getByRole('option', { name: 'United Kingdom (+44)' })).toBeInTheDocument();
  expect(screen.getByRole('option', { name: 'Select a pousada' })).toBeInTheDocument();
});

test('não envia o pedido só com o indicativo, sem o número de telefone', async () => {
  let now = 1_700_000_000_000;
  vi.spyOn(Date, 'now').mockImplementation(() => now);

  renderPousadas();

  const fill = (label, value) => fireEvent.change(screen.getByLabelText(label), { target: { value } });
  fill(/^nome/i, 'John Smith');
  fill(/morada/i, '1 High Street, London');
  fill(/^email/i, 'john@example.com');
  fill(/pousada onde/i, 'Pousada do Gerês');
  fill(/check-in/i, '2099-06-01');
  fill(/check-out/i, '2099-06-05');
  fill(/serviço solicitado/i, 'Enfermagem');
  fireEvent.click(screen.getByRole('checkbox', { name: /política de privacidade/i }));

  const phone = screen.getByLabelText(/contacto telefónico/i);
  expect(phone).toHaveValue('+351 ');
  expect(phone).toBeInvalid();

  now += 3100;
  await userEvent.click(screen.getByRole('button', { name: /enviar pedido/i }));
  expect(global.fetch).not.toHaveBeenCalled();

  fill(/contacto telefónico/i, '+351 912 345 678');
  expect(phone).toBeValid();
  await userEvent.click(screen.getByRole('button', { name: /enviar pedido/i }));
  await waitFor(() => expect(global.fetch).toHaveBeenCalledTimes(1));
});

test('todos os países do seletor têm bandeira (alojada no site)', async () => {
  expect(COUNTRIES.filter(({ code }) => !flagUrl(code)).map(({ code }) => code)).toEqual([]);

  renderPousadas();
  await userEvent.selectOptions(
    screen.getByRole('combobox', { name: /país do indicativo/i }),
    'GB'
  );
  expect(document.querySelector('.country-flag').getAttribute('src')).toMatch(/^\/.*\/gb\.[\w.-]*svg(\?|$)/);
});
