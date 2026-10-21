import { act } from 'react';
import { renderToString } from 'react-dom/server';
import { hydrateRoot } from 'react-dom/client';
import routes from '../../i18n/routes';
import { pickMessages } from '../../i18n/i18n';
import ContactForm from './ContactForm';
import PousadasForm from './PousadasForm';

// Os formulários são gerados em HTML no build e depois "hidratados" no
// browser. Se o primeiro render no browser for diferente do HTML do build
// (ex.: algo que depende do fuso horário ou da versão do Intl), o React deita
// fora o HTML e volta a desenhar o formulário. Este teste apanha isso.
const forms = {
  ContactForm: (lang) => (
    <ContactForm
      messages={pickMessages(lang, ['contacts.form', 'forms', 'common'])}
      privacyPath={routes[lang].privacy}
    />
  ),
  PousadasForm: (lang) => (
    <PousadasForm
      lang={lang}
      messages={pickMessages(lang, ['healthTourism.form', 'forms', 'common'])}
      privacyPath={routes[lang].privacy}
    />
  ),
};

test.each(
  Object.keys(forms).flatMap((name) => ['pt', 'en'].map((lang) => [name, lang]))
)('%s (%s) hidrata sem diferenças face ao HTML do build', async (name, lang) => {
  const container = document.createElement('div');
  container.innerHTML = renderToString(forms[name](lang));
  document.body.appendChild(container);

  const errors = [];
  let root;
  await act(async () => {
    root = hydrateRoot(container, forms[name](lang), {
      onRecoverableError: (error) => errors.push(error),
    });
  });

  expect(errors).toEqual([]);
  act(() => root.unmount());
  container.remove();
});
