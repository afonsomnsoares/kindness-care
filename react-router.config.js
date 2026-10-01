import { copyFile } from 'node:fs/promises';
import path from 'node:path';
import routes from './src/i18n/routes.js';

export default {
  appDirectory: 'src',
  buildDirectory: 'build',
  // Site estático: sem servidor Node em produção. Cada página listada em
  // src/i18n/routes.js é pré-renderizada para o seu próprio index.html no
  // build, para que Google, WhatsApp, Facebook, etc. vejam o conteúdo e as
  // meta tags certas sem precisarem de correr JavaScript.
  ssr: false,
  prerender: Object.values(routes).flatMap((langRoutes) => Object.values(langRoutes)),
  // Página 404 (configurada em public/.htaccess): a app arranca e mostra a
  // página 404.
  async buildEnd({ reactRouterConfig }) {
    const client = path.join(reactRouterConfig.buildDirectory, 'client');
    await copyFile(
      path.join(client, '__spa-fallback.html'),
      path.join(client, '404.html')
    );
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
