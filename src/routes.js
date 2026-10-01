import { route } from '@react-router/dev/routes';
import paths from './i18n/routes.js';

// Ficheiro de cada página; a chave é a mesma de src/i18n/routes.js, que
// define os caminhos em PT e EN. As páginas de serviço partilham o mesmo
// componente, que descobre qual serviço mostrar a partir do URL.
const pages = {
  home: 'pages/Home.jsx',
  history: 'pages/History.jsx',
  valueProposal: 'pages/Value-Proposal.jsx',
  mission: 'pages/Mission-Objectives-Values.jsx',
  homeCare: 'components/ServicePage.jsx',
  nursing: 'components/ServicePage.jsx',
  medical: 'components/ServicePage.jsx',
  caregiver: 'components/ServicePage.jsx',
  postpartum: 'components/ServicePage.jsx',
  contacts: 'pages/Contacts.jsx',
  healthTourism: 'pages/Health-Tourism-Service.jsx',
  pousadas: 'pages/Pousadas.jsx',
  privacy: 'pages/Privacy.jsx',
  terms: 'pages/Terms.jsx',
};

export default [
  ...Object.entries(pages).flatMap(([key, file]) =>
    Object.keys(paths).map((lang) =>
      route(paths[lang][key], file, { id: `${lang}-${key}` })
    )
  ),
  route('*', 'pages/NotFound.jsx'),
];
