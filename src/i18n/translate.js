/**
 * Função de tradução para os componentes interativos (React), a partir das
 * traduções que a página lhes passa (ver pickMessages em i18n.js):
 * createT(messages)('contacts.form.name'). Devolve a chave se não existir.
 */
export function createT(messages) {
  return (key) => {
    const value = key
      .split('.')
      .reduce((node, part) => (node == null ? undefined : node[part]), messages);
    return value ?? key;
  };
}
