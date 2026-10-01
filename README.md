# Kindness & Care — Website

Site institucional da Kindness & Care (www.kindnesscare.pt), serviço de apoio
domiciliário em Braga, Guimarães e Viana do Castelo. Bilingue (PT/EN).

Feito em React 19 com React Router 7 (modo framework, sobre Vite) e i18next.
Cada página é pré-renderizada para HTML no build, para que motores de busca e
pré-visualizações de links (WhatsApp, Facebook, LinkedIn) vejam o conteúdo e
as meta tags certas de cada página. Requer Node 22.12 ou mais recente.

## Comandos

| Comando | O que faz |
| --- | --- |
| `npm install` | Instala as dependências |
| `npm run dev` | Servidor de desenvolvimento em http://localhost:5173 |
| `npm test` | Corre os testes (Vitest + Testing Library); `npm run test:watch` em modo contínuo |
| `npm run build` | Gera o site estático em `build/client/` |
| `npm run preview` | Serve o `build/client/` localmente, como em produção |
| `npm run convert-images` | Converte JPG/PNG novos em `src/images/` para WebP |
| `npm run test-server` | Servidor local para testar emails dos formulários (ver abaixo) |

## Estrutura

```
public/            robots.txt, og-image.jpg, ícones, .htaccess (Apache)
react-router.config.js  Pré-render das páginas e opções do React Router
src/
  root.jsx         Documento HTML base, cabeçalho/rodapé comuns, idioma
  routes.js        Rotas, geradas a partir de src/i18n/routes.js
  components/      Layout (TopBar, NavigationBar, Footer), MetaTags,
                   ServicePage (páginas de serviço partilhadas), Toast, cookies,
                   FormFields (honeypot e consentimento dos formulários)
  hooks/           useContactForm (envio dos formulários), useAntiSpam
  lib/             Consentimento de cookies, URL do site, gerador do sitemap
  i18n/            Configuração do i18next, rotas PT/EN e traduções
  pages/           Uma página por ficheiro
  images/          Imagens em WebP
```

### Adicionar ou alterar uma página

1. Acrescente o caminho PT e EN em `src/i18n/routes.js`.
2. Associe a chave ao ficheiro da página no objeto `pages` em `src/routes.js`.
   A página passa a ser pré-renderizada automaticamente nos dois idiomas.
3. Acrescente o título e a descrição em `meta.<chave>` em
   `src/i18n/locales/pt/common.json` e `en/common.json`, e use
   `<MetaTags page="<chave>" />` na página.

O `sitemap.xml` é gerado no build a partir de `src/i18n/routes.js`
(`src/lib/sitemap.js`), com todas as páginas nos dois idiomas.

### Estilos

Cada página importa o seu próprio CSS, que só é carregado quando a página é
visitada. Por isso:

- Classes usadas em várias páginas (`container`, `container-xxl`, `py-5`,
  ...) ficam em `src/App.css`, que é sempre carregado.
- Classes de uma página devem ter um prefixo próprio (`contacts-`,
  `pousadas-`, ...). Se duas páginas definirem a mesma classe, o aspeto passa
  a depender da ordem em que o visitante as abriu.

As páginas de serviço com o mesmo layout (apoio domiciliário, enfermagem,
assistência médica, apoio ao cuidador, pós-parto) são todas geradas por
`src/components/ServicePage.jsx`, que escolhe o serviço a partir do URL; o
texto vem das traduções.

### Textos e traduções

Todo o texto visível está em `src/i18n/locales/{pt,en}/common.json`. Ao
alterar um texto, atualize os dois idiomas. O idioma de cada página vem
sempre do URL (`/en/...` é inglês, o resto é português), nunca do browser.

### Imagens

Coloque a imagem original (JPG/PNG) em `src/images/`, corra
`npm run convert-images`, importe a versão `.webp` e apague o original.

## Formulários

Os formulários de Contactos e Pousadas de Portugal enviam para
`geral@kindnesscare.pt` através do [FormSubmit](https://formsubmit.co)
(`src/hooks/useContactForm.js`). O plano gratuito permite 100 envios por dia.
O anti-spam (honeypot + tempo mínimo de preenchimento) está em
`src/hooks/useAntiSpam.js`. Os dois formulários pedem o consentimento para o
tratamento dos dados (podem incluir dados de saúde).

O endereço de envio pode ser alterado com `VITE_FORM_ENDPOINT` (ver
`.env.example`). Recomenda-se usar o alias aleatório do FormSubmit, para o
email não aparecer no código do site.

Para testar localmente sem enviar emails reais: crie `.env.local` com
`VITE_FORM_ENDPOINT=http://localhost:4000/send-email`, corra
`npm run test-server` e, noutro terminal, `npm run dev`. O servidor usa o
Ethereal (emails falsos; o link de pré-visualização aparece na consola).

## Google Analytics

Só é carregado depois de o visitante aceitar os cookies
(`src/components/GAnalytics.jsx`). O visitante pode mudar de ideias em
"Definições de cookies", no rodapé; se recusar, os cookies do GA são apagados. O ID pode ser definido em
`VITE_GA_MEASUREMENT_ID` (ver `.env.example`).

## Publicação

`npm run build` gera um site estático em `build/client/`: publique o conteúdo
dessa pasta. Não é preciso servidor Node.

- Cada página tem o seu `index.html` (ex.: `build/client/contactos/index.html`).
  O alojamento deve servi-la em `/contactos`, sem barra final.
- Caminhos desconhecidos devem devolver `404.html`, que arranca a app e mostra
  a página 404.
- Em Apache, o `.htaccess` incluído trata disto, e também do redirecionamento
  para `https://www.kindnesscare.pt`, dos cabeçalhos de segurança, da cache
  e da compressão.
