import { defineConfig } from 'astro/config';
import { loadEnv } from 'vite';
import react from '@astrojs/react';

const env = loadEnv(process.env.NODE_ENV ?? 'production', process.cwd(), 'PUBLIC_');

// Para onde os formulários enviam (ver src/hooks/useContactForm.js): a
// Content Security Policy tem de permitir esse endereço.
const formOrigin = new URL(
  env.PUBLIC_FORM_ENDPOINT || 'https://formsubmit.co/ajax/geral@kindnesscare.pt'
).origin;

// Google Analytics 4 (só carrega depois de aceitar os cookies).
const googleAnalytics = [
  'https://*.googletagmanager.com',
  'https://*.google-analytics.com',
  'https://*.analytics.google.com',
];

// Site estático: cada página é gerada no build para o seu próprio
// index.html (ex.: dist/historia/index.html), servido em /historia, sem
// barra final. Só os formulários usam React no browser (client:load); o
// resto é HTML e CSS, com pequenos scripts para o menu e os cookies.
export default defineConfig({
  site: 'https://www.kindnesscare.pt',
  trailingSlash: 'never',
  build: {
    format: 'directory',
  },
  integrations: [react()],
  // O site não tem Markdown; o realce de código (Shiki) usaria estilos
  // inline, que a Content Security Policy bloqueia.
  markdown: {
    syntaxHighlight: false,
  },
  security: {
    // Content Security Policy: o Astro acrescenta a cada página uma <meta>
    // com a lista do que o browser pode carregar; os scripts e estilos do
    // site entram por hash. Tudo o resto é bloqueado, o que trava a maioria
    // dos ataques de injeção de código. Ao acrescentar um serviço externo
    // (mapa, vídeo, chat...), é preciso autorizá-lo aqui.
    csp: {
      directives: [
        "default-src 'self'",
        "base-uri 'self'",
        "object-src 'none'",
        "form-action 'self'",
        // Bandeiras pequenas do seletor de país (data:) e pixels do GA.
        `img-src 'self' data: ${googleAnalytics.join(' ')}`,
        `connect-src 'self' ${formOrigin} ${googleAnalytics.join(' ')}`,
      ],
      scriptDirective: {
        resources: ["'self'", 'https://www.googletagmanager.com'],
      },
    },
  },
});
