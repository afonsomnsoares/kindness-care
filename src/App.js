import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import './App.css';
import TopBar from './components/TopBar';
import NavigationBar from './components/NavigationBar';
import Footer from './components/Footer';
import CookieConsent from './components/CookieConsent';
import BackToTop from './components/BackToTop';
import { ToastProvider } from './components/Toast';
import GAnalytics from './components/GAnalytics';
import SEO from './components/SEO';

const Home = lazy(() => import('./pages/Home'));
const History = lazy(() => import('./pages/History'));
const ValueProposal = lazy(() => import('./pages/Value-Proposal'));
const MissionValues = lazy(() => import('./pages/Mission-Objectives-Values'));
const HomeCare = lazy(() => import('./pages/Home-Care'));
const PousadasForm = lazy(() => import('./pages/Health-Tourism'));
const NursingRehabilitation = lazy(() => import('./pages/Nursing-Rehabilitation'));
const MedicalAssistance = lazy(() => import('./pages/Medical-Assistance'));
const CaregiverSupport = lazy(() => import('./pages/Caregiver-Support'));
const PostpartumSupport = lazy(() => import('./pages/Postpartum-Support'));
const Contacts = lazy(() => import('./pages/Contacts'));
const HealthTourismService = lazy(() => import('./pages/Health-Tourism-Service'));
const Privacy = lazy(() => import('./pages/Privacy'));
const Terms = lazy(() => import('./pages/Terms'));
const NotFound = lazy(() => import('./pages/NotFound'));

function Loading() {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '50vh',
      color: '#094352',
      fontSize: '1.2rem'
    }}>
      Loading...
    </div>
  );
}

function App() {
  return (
    <HelmetProvider>
      <Router>
        <ToastProvider>
          <div className="App">
            <GAnalytics />
            <SEO />
            <TopBar />
            <NavigationBar />
            <main className="main-content">
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
                <Route path="/turismo-saude-bem-estar" element={<HealthTourismService />} />
                <Route path="/en/health-tourism" element={<HealthTourismService />} />
                <Route path="/privacidade" element={<Privacy />} />
                <Route path="/termos" element={<Terms />} />
                <Route path="/en/privacy" element={<Privacy />} />
                <Route path="/en/terms" element={<Terms />} />
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