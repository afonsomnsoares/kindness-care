import pt from './locales/pt/common.json';
import en from './locales/en/common.json';

// Uma tradução em falta em inglês não dá erro: o i18next mostra o texto em
// português (fallbackLng), e a página inglesa fica com frases em PT.

/** Todas as chaves de um ficheiro de traduções ('home.about.paragraphs.0', ...). */
function keys(messages, prefix = '') {
  return Object.entries(messages).flatMap(([key, value]) =>
    value !== null && typeof value === 'object'
      ? keys(value, `${prefix}${key}.`)
      : [`${prefix}${key}`]
  );
}

test('PT e EN têm as mesmas chaves de tradução', () => {
  const ptKeys = keys(pt);
  const enKeys = keys(en);

  expect(ptKeys.filter((k) => !enKeys.includes(k))).toEqual([]);
  expect(enKeys.filter((k) => !ptKeys.includes(k))).toEqual([]);
});
