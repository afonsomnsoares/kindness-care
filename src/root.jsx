import React from 'react';
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLocation,
} from 'react-router';
import { I18nextProvider, useTranslation } from 'react-i18next';
import './index.css';
import './App.css';
import TopBar from './components/TopBar';
import NavigationBar from './components/NavigationBar';
import Footer from './components/Footer';
import CookieConsent from './components/CookieConsent';
import BackToTop from './components/BackToTop';
import { ToastProvider } from './components/Toast';
import GAnalytics from './components/GAnalytics';
import { getI18n } from './i18n/i18n';
import { langFromPath } from './i18n/routes';

// Dados estruturados da empresa, comuns a todas as páginas.
const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "Kindness & Care",
  "description": "Serviço de Apoio Domiciliário com profissionais de saúde especializados. Spin-off da Universidade do Minho.",
  "url": "https://www.kindnesscare.pt",
  "telephone": "+351968844420",
  "email": "geral@kindnesscare.pt",
  "logo": "https://www.kindnesscare.pt/logo.jpg",
  "image": "https://www.kindnesscare.pt/og-image.jpg",
  "foundingDate": "2025",
  "areaServed": ["Braga", "Guimarães", "Viana do Castelo"],
  "address": {
    "@type": "PostalAddress",
    "addressRegion": "Braga",
    "addressCountry": "PT"
  },
  "openingHoursSpecification": [
    {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      "opens": "00:00",
      "closes": "23:59"
    }
  ],
  "sameAs": [
    "https://facebook.com/kindnesscare",
    "https://instagram.com/kindnesscare",
    "https://linkedin.com/company/kindnesscare"
  ],
  "parentOrganization": {
    "@type": "CollegeOrUniversity",
    "name": "Universidade do Minho"
  }
};

/** Documento HTML base (substitui o antigo public/index.html). */
export function Layout({ children }) {
  const { pathname } = useLocation();

  return (
    <html lang={langFromPath(pathname)}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#094352" />
        <meta name="author" content="Kindness & Care" />
        <meta name="robots" content="index, follow" />
        <link rel="icon" href="/logo.jpg" />
        <link rel="apple-touch-icon" href="/logo.jpg" />
        <link rel="manifest" href="/manifest.json" />
        <Meta />
        <Links />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

/** Estrutura comum a todas as páginas: cabeçalho, conteúdo e rodapé. */
export function AppShell() {
  return (
    <ToastProvider>
      <div className="App">
        <GAnalytics />
        <TopBar />
        <NavigationBar />
        <main className="main-content">
          <Outlet />
        </main>
        <CookieConsent />
        <BackToTop />
        <Footer />
      </div>
    </ToastProvider>
  );
}

export default function App() {
  const { pathname } = useLocation();

  return (
    <I18nextProvider i18n={getI18n(langFromPath(pathname))}>
      <AppShell />
    </I18nextProvider>
  );
}

function Loading() {
  const { t } = useTranslation();
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '50vh',
      color: '#094352',
      fontSize: '1.2rem'
    }}>
      {t('loading')}
    </div>
  );
}

/** Mostrado enquanto a app arranca num caminho que não foi pré-renderizado. */
export function HydrateFallback() {
  const { pathname } = useLocation();

  return (
    <I18nextProvider i18n={getI18n(langFromPath(pathname))}>
      <Loading />
    </I18nextProvider>
  );
}
