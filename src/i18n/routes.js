const routes = {
  pt: {
    home: '/',
    history: '/historia',
    valueProposal: '/proposta-de-valor',
    mission: '/missao-objetivos-valores',
    homeCare: '/apoio-domiciliario',
    nursing: '/enfermagem-reabilitacao',
    medical: '/assistencia-medica',
    caregiver: '/apoio-cuidador-familia',
    postpartum: '/apoio-pos-parto',
    contacts: '/contactos',
    healthTourism: '/turismo-saude-bem-estar',
    pousadas: '/pousadas-portugal',
    privacy: '/privacidade',
    terms: '/termos',
  },
  en: {
    home: '/en',
    history: '/en/history',
    valueProposal: '/en/value-proposal',
    mission: '/en/mission-objectives-values',
    homeCare: '/en/home-care',
    nursing: '/en/nursing-rehabilitation',
    medical: '/en/medical-assistance',
    caregiver: '/en/caregiver-support',
    postpartum: '/en/postpartum-support',
    contacts: '/en/contacts',
    healthTourism: '/en/health-tourism',
    pousadas: '/en/pousadas-portugal',
    privacy: '/en/privacy',
    terms: '/en/terms',
  },
};

/** Idioma de um caminho: tudo o que está debaixo de /en é inglês. */
export function langFromPath(pathname) {
  return pathname === '/en' || pathname.startsWith('/en/') ? 'en' : 'pt';
}

/** Chave da rota (ex.: 'contacts') para um caminho PT ou EN, ou undefined. */
export function routeKeyForPath(pathname) {
  const clean = pathname.replace(/\/+$/, '') || '/';
  return Object.keys(routes.pt).find(
    (k) => routes.pt[k] === clean || routes.en[k] === clean
  );
}

export default routes;