import { getViteConfig } from 'astro/config';

// Usa a configuração do Astro, para os testes poderem renderizar componentes
// .astro (ver src/pages.test.js) além dos componentes React dos formulários.
export default getViteConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/setupTests.js',
  },
});
