import { reactRouter } from '@react-router/dev/vite';
import { defineConfig } from 'vite';

export default defineConfig({
  // O plugin do React Router não corre nos testes (Vitest renderiza os
  // componentes diretamente).
  plugins: [!process.env.VITEST && reactRouter()],
  resolve: {
    alias: {
      // O pacote tem uma versão ESM ("module"), mas sem "exports" o Node usa
      // a versão CommonJS, e no pré-render o import por defeito devolve o
      // módulo inteiro em vez do componente. Apontamos diretamente para a ESM.
      'react-country-flag': 'react-country-flag/dist/react-country-flag.esm.js',
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/setupTests.js',
  },
});
