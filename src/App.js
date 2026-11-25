import React, { lazy, Suspense, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { languageFromPathname } from './i18n/language';
import './App.css';
import TopBar from './components/TopBar';
import NavigationBar from './components/NavigationBar';
import Footer from './components/Footer';
import CookieConsent from './components/CookieConsent';
import BackToTop from './components/BackToTop';
import { ToastProvider } from './components/Toast';
import GoogleAnalytics from './components/GoogleAnalytics';
import SEO from './components/SEO';
import Home from './pages/Home';
const History = lazy(() => import('./pages/History'));
const ValueProposal = lazy(() => import('./pages/ValueProposal'));
const MissionValues = lazy(() => import('./pages/MissionValues'));
const HomeCare = lazy(() => import('./pages/HomeCare'));
const PousadasForm = lazy(() => import('./pages/PousadasForm'));
const NursingRehabilitation = lazy(() => import('./pages/NursingRehabilitation'));
const MedicalAssistance = lazy(() => import('./pages/MedicalAssistance'));
const CaregiverSupport = lazy(() => import('./pages/CaregiverSupport'));
const PostpartumSupport = lazy(() => import('./pages/PostpartumSupport'));
const Contacts = lazy(() => import('./pages/Contacts'));
const HealthTourism = lazy(() => import('./pages/HealthTourism'));
const Privacy = lazy(() => import('./pages/Privacy'));
const Terms = lazy(() => import('./pages/Terms'));
const Testimonials = lazy(() => import('./pages/Testimonials'));
const KindnessCare = lazy(() => import('./pages/KindnessCare'));
const KindnessLongevity = lazy(() => import('./pages/KindnessLongevity'));
const KindnessAcademy = lazy(() => import('./pages/KindnessAcademy'));
const KindnessExperiences = lazy(() => import('./pages/KindnessExperiences'));
const NotFound = lazy(() => import('./pages/NotFound'));

function LanguageFromPath() {
  const { i18n } = useTranslation();
  const { pathname } = useLocation();
  useEffect(() => {
    const lang = languageFromPathname(pathname);
    if (!i18n.language?.startsWith(lang)) {
      i18n.changeLanguage(lang);
    }
    const main = document.getElementById('conteudo');
    if (main) {
      main.tabIndex = -1;
      main.focus({ preventScroll: true });
    }
  }, [pathname, i18n]);
  return null;
}

function Loading() {
  const { t } = useTranslation();
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '50vh',
      background: '#ffffff',
      color: '#094352',
      fontSize: '1.2rem'
    }} role="status">
      {t('loading')}
    </div>
  );
}

function SkipLink() {
  const { t } = useTranslation();
  return <a className="skip-link" href="#conteudo">{t('nav.skip')}</a>;
}

function isSafeInternalPath(value) {
  if (typeof value !== 'string' || value.length < 1 || value.length > 512) return false;
  if (!value.startsWith('/') || value.startsWith('//') || value.includes('\\') || value.includes('://')) return false;
  for (let i = 0; i < value.length; i += 1) {
    const code = value.charCodeAt(i);
    if (code <= 32 || code === 127) return false;
  }
  return true;
}

function SpaRecovery() {
  const navigate = useNavigate();

  useEffect(() => {
    const recoverChunk = (event) => {
      const message = String(event?.reason?.message || event?.message || '');
      if (!/ChunkLoadError|Loading chunk \d+ failed|dynamically imported module/i.test(message)) return;
      const here = `${window.location.pathname}${window.location.search}${window.location.hash}`;
      if (!isSafeInternalPath(here)) return;
      try {
        if (sessionStorage.getItem('kc-chunk-reloaded') === here) return;
        sessionStorage.setItem('kc-chunk-reloaded', here);
        if (here !== '/') sessionStorage.setItem('kc-spa-path', here);
      } catch (e) {
        return;
      }
      window.location.reload();
    };

    window.addEventListener('unhandledrejection', recoverChunk);
    window.addEventListener('error', recoverChunk);

    let stored = '';
    try {
      stored = sessionStorage.getItem('kc-spa-path') || '';
      if (stored) sessionStorage.removeItem('kc-spa-path');
    } catch (e) {
      stored = '';
    }
    if (isSafeInternalPath(stored) && stored !== '/') {
      navigate(stored, { replace: true });
    }

    return () => {
      window.removeEventListener('unhandledrejection', recoverChunk);
      window.removeEventListener('error', recoverChunk);
    };
  }, [navigate]);

  return null;
}

function TrailingSlash() {
  const { pathname, search, hash } = useLocation();
  if (pathname.length > 1 && pathname.endsWith('/')) {
    return <Navigate to={`${pathname.replace(/\/+$/, '')}${search}${hash}`} replace />;
  }
  return null;
}

function App() {
  return (
    <HelmetProvider>
      <Router>
        <ToastProvider>
          <div className="App">
            <GoogleAnalytics />
            <SEO />
            <SpaRecovery />
            <TrailingSlash />
            <LanguageFromPath />
            <SkipLink />
            <TopBar />
            <NavigationBar />
            <main id="conteudo" className="main-content">
              <Suspense fallback={<Loading />}>
                <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/en" element={<Home />} />
                <Route path="/historia" element={<History />} />
                <Route path="/en/history" element={<History />} />
                <Route path="/proposta-de-valor" element={<ValueProposal />} />
                <Route path="/en/value-proposal" element={<ValueProposal />} />
                <Route path="/missao-objetivos-valores" element={<MissionValues />} />
                <Route path="/en/mission-objectives-values" element={<MissionValues />} />
                <Route path="/kindness-care" element={<KindnessCare />} />
                <Route path="/en/kindness-care" element={<KindnessCare />} />
                <Route path="/kindness-longevity" element={<KindnessLongevity />} />
                <Route path="/en/kindness-longevity" element={<KindnessLongevity />} />
                <Route path="/kindness-academy" element={<KindnessAcademy />} />
                <Route path="/en/kindness-academy" element={<KindnessAcademy />} />
                <Route path="/kindness-experiences" element={<KindnessExperiences />} />
                <Route path="/en/kindness-experiences" element={<KindnessExperiences />} />
                <Route path="/apoio-domiciliario" element={<HomeCare />} />
                <Route path="/en/home-care" element={<HomeCare />} />
                <Route path="/pousadas-portugal" element={<PousadasForm />} />
                <Route path="/en/pousadas-portugal" element={<PousadasForm />} />
                <Route path="/enfermagem-reabilitacao" element={<NursingRehabilitation />} />
                <Route path="/en/nursing-rehabilitation" element={<NursingRehabilitation />} />
                <Route path="/assistencia-medica" element={<MedicalAssistance />} />
                <Route path="/en/medical-assistance" element={<MedicalAssistance />} />
                <Route path="/apoio-cuidador-familia" element={<CaregiverSupport />} />
                <Route path="/en/caregiver-support" element={<CaregiverSupport />} />
                <Route path="/apoio-pos-parto" element={<PostpartumSupport />} />
                <Route path="/en/postpartum-support" element={<PostpartumSupport />} />
                <Route path="/contactos" element={<Contacts />} />
                <Route path="/en/contacts" element={<Contacts />} />
                <Route path="/turismo-saude-bem-estar" element={<HealthTourism />} />
                <Route path="/en/health-tourism" element={<HealthTourism />} />
                <Route path="/privacidade" element={<Privacy />} />
                <Route path="/termos" element={<Terms />} />
                <Route path="/en/privacy" element={<Privacy />} />
                <Route path="/en/terms" element={<Terms />} />
                <Route path="/testemunhos" element={<Testimonials />} />
                <Route path="/en/testimonials" element={<Testimonials />} />
                <Route path="/perguntas-frequentes" element={<Navigate to="/" replace />} />
                <Route path="/en/faq" element={<Navigate to="/en" replace />} />
                <Route path="/testumunhos" element={<Navigate to="/testemunhos" replace />} />
                <Route path="/en/testumunhos" element={<Navigate to="/en/testimonials" replace />} />
                <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>
            </main>
            <CookieConsent />
            <BackToTop />
            <Footer />
          </div>
        </ToastProvider>
      </Router>
    </HelmetProvider>
  );
}

export default App;