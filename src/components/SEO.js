import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const canonicalMap = {
  '/': 'https://www.kindnesscare.pt',
  '/en': 'https://www.kindnesscare.pt/en',
  '/historia': 'https://www.kindnesscare.pt/historia',
  '/en/history': 'https://www.kindnesscare.pt/en/history',
  '/proposta-de-valor': 'https://www.kindnesscare.pt/proposta-de-valor',
  '/en/value-proposal': 'https://www.kindnesscare.pt/en/value-proposal',
  '/missao-objetivos-valores': 'https://www.kindnesscare.pt/missao-objetivos-valores',
  '/en/mission-objectives-values': 'https://www.kindnesscare.pt/en/mission-objectives-values',
  '/apoio-domiciliario': 'https://www.kindnesscare.pt/apoio-domiciliario',
  '/en/home-care': 'https://www.kindnesscare.pt/en/home-care',
  '/pousadas-portugal': 'https://www.kindnesscare.pt/pousadas-portugal',
  '/en/pousadas-portugal': 'https://www.kindnesscare.pt/en/pousadas-portugal',
  '/enfermagem-reabilitacao': 'https://www.kindnesscare.pt/enfermagem-reabilitacao',
  '/en/nursing-rehabilitation': 'https://www.kindnesscare.pt/en/nursing-rehabilitation',
  '/assistencia-medica': 'https://www.kindnesscare.pt/assistencia-medica',
  '/en/medical-assistance': 'https://www.kindnesscare.pt/en/medical-assistance',
  '/apoio-cuidador-familia': 'https://www.kindnesscare.pt/apoio-cuidador-familia',
  '/en/caregiver-support': 'https://www.kindnesscare.pt/en/caregiver-support',
  '/apoio-pos-parto': 'https://www.kindnesscare.pt/apoio-pos-parto',
  '/en/postpartum-support': 'https://www.kindnesscare.pt/en/postpartum-support',
  '/contactos': 'https://www.kindnesscare.pt/contactos',
  '/en/contacts': 'https://www.kindnesscare.pt/en/contacts',
  '/turismo-saude-bem-estar': 'https://www.kindnesscare.pt/turismo-saude-bem-estar',
  '/en/health-tourism': 'https://www.kindnesscare.pt/en/health-tourism',
  '/privacidade': 'https://www.kindnesscare.pt/privacidade',
  '/termos': 'https://www.kindnesscare.pt/termos',
  '/en/privacy': 'https://www.kindnesscare.pt/en/privacy',
  '/en/terms': 'https://www.kindnesscare.pt/en/terms',
};

function SEO() {
  const { i18n } = useTranslation();
  const location = useLocation();

  useEffect(() => {
    const lang = i18n.language?.startsWith('en') ? 'en' : 'pt';
    document.documentElement.lang = lang;
  }, [i18n.language]);

  useEffect(() => {
    const path = location.pathname;
    const canonical = canonicalMap[path] || 'https://www.kindnesscare.pt';
    let link = document.querySelector('link[rel="canonical"]');
    if (link) {
      link.setAttribute('href', canonical);
    } else {
      link = document.createElement('link');
      link.rel = 'canonical';
      link.href = canonical;
      document.head.appendChild(link);
    }
  }, [location.pathname]);

  return null;
}

export default SEO;