# Kindness & Care — Website

Site institucional da Kindness & Care (www.kindnesscare.pt), serviço de apoio
domiciliário em Braga, Guimarães e Viana do Castelo. Bilingue (PT/EN).

Feito em [Astro](https://astro.build), com i18next para as traduções. Cada
página é gerada em HTML no build, para que motores de busca e
pré-visualizações de links (WhatsApp, Facebook, LinkedIn) vejam o conteúdo e
as meta tags certas de cada página. O browser recebe HTML e CSS, com pequenos
scripts para o menu e o aviso de cookies; só os dois formulários usam React.
Requer Node 22.12 ou mais recente.

## Comandos

| Comando | O que faz |
| --- | --- |
| `npm install` | Instala as dependências |
| `npm run dev` | Servidor de desenvolvimento em http://localhost:4321 |
| `npm test` | Corre os testes (Vitest + Testing Library); `npm run test:watch` em modo contínuo |
| `npm run build` | Gera o site estático em `dist/` |
| `npm run preview` | Serve o `dist/` localmente, como em produção |
| `npm run convert-images` | Converte JPG/PNG novos em `src/images/` para WebP |
| `npm run test-server` | Servidor local para testar emails dos formulários (ver abaixo) |

## Estrutura

```
astro.config.mjs   Configuração do Astro (site estático, URLs sem barra final)
public/            robots.txt, og-image.jpg, ícones, .htaccess (Apache)
src/
  pages/           Rotas: [...path].astro gera todas as páginas a partir de
                   src/i18n/routes.js; 404 em PT e EN; sitemap.xml
  layouts/         Layout.astro: <head> (meta tags, dados estruturados) e a
                   estrutura comum a todas as páginas
  views/           O conteúdo de cada página (.astro) e o seu CSS
  components/      TopBar, NavigationBar, Footer, aviso de cookies, Google
                   Analytics; forms/ tem os formulários (React)
  scripts/         Comportamento do menu e do aviso de cookies
  hooks/           useContactForm (envio dos formulários), useAntiSpam
  lib/             Consentimento de cookies, URL do site, gerador do sitemap
  i18n/            Rotas PT/EN, traduções e funções de tradução
  styles/          CSS global (variáveis, layout partilhado)
  images/          Imagens em WebP
```

### Adicionar ou alterar uma página

1. Acrescente o caminho PT e EN em `src/i18n/routes.js`.
2. Crie a página em `src/views/` (veja `History.astro` como exemplo: recebe
   `lang` e usa `<Layout lang={lang} page="<chave>">`).
3. Associe a chave à página no objeto `views` em `src/pages/[...path].astro`.
   A página passa a ser gerada automaticamente nos dois idiomas, e entra no
   `sitemap.xml`.
4. Acrescente o título e a descrição em `meta.<chave>` em
   `src/i18n/locales/pt/common.json` e `en/common.json`.

As páginas de serviço com o mesmo layout (apoio domiciliário, enfermagem,
assistência médica, apoio ao cuidador, pós-parto) são todas geradas por
`src/views/ServicePage.astro`; o texto vem das traduções. A Política de
Privacidade e os Termos usam `src/views/Legal.astro`.

### Estilos

Cada página importa o seu próprio CSS, que só é incluído nessa página. Por
isso:

- Classes usadas em várias páginas (`container`, `container-xxl`, `py-5`,
  ...) ficam em `src/styles/App.css`, incluído em todas.
- Classes de uma página devem ter um prefixo próprio (`contacts-`,
  `pousadas-`, ...). Um teste falha se duas folhas de estilo definirem a
  mesma classe.

### Textos e traduções

Todo o texto visível está em `src/i18n/locales/{pt,en}/common.json`. Ao
alterar um texto, atualize os dois idiomas. O idioma de cada página vem
sempre do URL (`/en/...` é inglês, o resto é português), nunca do browser.

Nas páginas `.astro`, use `const t = getT(lang)` (`src/i18n/i18n.js`). Os
formulários recebem só as traduções de que precisam (`pickMessages`), para não
enviar o ficheiro inteiro para o browser.

### Imagens

Coloque a imagem original (JPG/PNG) em `src/images/`, corra
`npm run convert-images`, importe a versão `.webp` e apague o original. Numa
página `.astro`, use `imagem.src` no `<img>`.

## Formulários

Os formulários de Contactos e Pousadas de Portugal
(`src/components/forms/`) enviam para `geral@kindnesscare.pt` através do
[FormSubmit](https://formsubmit.co) (`src/hooks/useContactForm.js`). O plano
gratuito permite 100 envios por dia. O anti-spam (honeypot + tempo mínimo de
preenchimento) está em `src/hooks/useAntiSpam.js`. Os dois formulários pedem o
consentimento para o tratamento dos dados (podem incluir dados de saúde).

O endereço de envio pode ser alterado com `PUBLIC_FORM_ENDPOINT` (ver
`.env.example`). Recomenda-se usar o alias aleatório do FormSubmit, para o
email não aparecer no código do site.

Para testar localmente sem enviar emails reais: crie `.env.local` com
`PUBLIC_FORM_ENDPOINT=http://localhost:4000/send-email`, corra
`npm run test-server` e, noutro terminal, `npm run dev`. O servidor usa o
Ethereal (emails falsos; o link de pré-visualização aparece na consola).

## Google Analytics

Só é carregado depois de o visitante aceitar os cookies
(`src/components/Analytics.astro`). O visitante pode mudar de ideias em
"Definições de cookies", no rodapé; se recusar, os cookies do GA são
apagados. O ID pode ser definido em `PUBLIC_GA_MEASUREMENT_ID` (ver
`.env.example`).

## Segurança

- **Content Security Policy:** cada página diz ao browser de onde pode
  carregar scripts, estilos, imagens e ligações (configurado em
  `astro.config.mjs`, secção `security.csp`). Ao acrescentar um serviço
  externo (mapa, vídeo, chat, outro formulário...), autorize o domínio aí;
  caso contrário o browser bloqueia-o (aparece um erro na consola). A CSP não
  funciona em `npm run dev`: teste com `npm run build` e `npm run preview`.
- **Sem atributos `style="..."`:** a CSP bloqueia-os. Use classes no CSS
  (há um teste que falha se uma página os tiver).
- **Formulários:** o anti-spam corre no browser e um bot pode contorná-lo
  enviando diretamente ao FormSubmit. Se o spam esgotar o limite diário,
  a solução é pôr uma função serverless (ex.: Cloudflare Worker com Turnstile
  e limite por IP) entre o site e o FormSubmit.

## Publicação

`npm run build` gera um site estático em `dist/`: publique o conteúdo dessa
pasta. Não é preciso servidor Node.

- Cada página tem o seu `index.html` (ex.: `dist/contactos/index.html`). O
  alojamento deve servi-la em `/contactos`, sem barra final.
- Caminhos desconhecidos devem devolver `404.html` (ou `en/404/index.html`
  para caminhos em `/en/...`).
- Em Apache, o `.htaccess` incluído trata disto, e também do redirecionamento
  para `https://www.kindnesscare.pt`, dos cabeçalhos de segurança, da cache
  e da compressão.
