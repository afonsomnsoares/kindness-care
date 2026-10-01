import { copyFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import routes from './src/i18n/routes.js';
import { buildSitemap } from './src/lib/sitemap.js';

export default {
  appDirectory: 'src',
  buildDirectory: 'build',
  // Site estático: sem servidor Node em produção. Cada página listada em
  // src/i18n/routes.js é pré-renderizada para o seu próprio index.html no
  // build, para que Google, WhatsApp, Facebook, etc. vejam o conteúdo e as
  // meta tags certas sem precisarem de correr JavaScript.
  ssr: false,
  prerender: Object.values(routes).flatMap((langRoutes) => Object.values(langRoutes)),
  async buildEnd({ reactRouterConfig }) {
    const client = path.join(reactRouterConfig.buildDirectory, 'client');
    // Página 404 (configurada em public/.htaccess): a app arranca e mostra a
    // página 404.
    await copyFile(
      path.join(client, '__spa-fallback.html'),
      path.join(client, '404.html')
    );
    // sitemap.xml gerado a partir das rotas, nos dois idiomas.
    await writeFile(path.join(client, 'sitemap.xml'), buildSitemap());
  },
  // Comportamentos do React Router v8, ativados já para facilitar a
  // atualização futura.
  future: {
    v8_middleware: true,
    v8_splitRouteModules: true,
    v8_viteEnvironmentApi: true,
    v8_passThroughRequests: true,
    v8_trailingSlashAwareDataRequests: true,
  },
};
