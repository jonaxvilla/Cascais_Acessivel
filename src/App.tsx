import React, { useState } from 'react';
import { AppDataProvider, useAppData } from './context/AppDataContext';
import { Navigation } from './components/Navigation';
import { LandingPage } from './pages/LandingPage';
import { MerchantPage } from './pages/MerchantPage';
import { MunicipalityPage } from './pages/MunicipalityPage';
import { CitizenPage } from './pages/CitizenPage';
import { AppView } from './types';

const VIEW_LABELS: Record<Exclude<AppView, 'home'>, string> = {
  citizen: '01 · Portal do Cidadão',
  merchant: '02 · Portal do Comerciante',
  municipality: '03 · Portal da Autarquia',
};

const AppShell: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>('home');
  const {
    establishments,
    reports,
    storageWarning,
    dismissStorageWarning,
  } = useAppData();

  const openReportCount = reports.filter((r) => r.status === 'open').length;

  const handleSelectView = (view: AppView) => {
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="app-layout">
      <a href="#main-content" className="skip-link">
        Saltar para o conteúdo principal
      </a>

      <Navigation
        currentView={currentView}
        onSelectView={handleSelectView}
        establishmentCount={establishments.length}
        openReportCount={openReportCount}
      />

      {currentView !== 'home' && (
        <div className="subview-bar">
          <div className="container subview-bar-inner">
            <div className="breadcrumb-trail">
              <button
                type="button"
                className="breadcrumb-back-btn"
                onClick={() => handleSelectView('home')}
              >
                ← Início
              </button>
              <span className="breadcrumb-sep" aria-hidden="true">
                /
              </span>
              <span className="breadcrumb-current">
                {VIEW_LABELS[currentView]}
              </span>
            </div>

            <span className="subview-local-note">
              <strong>Demonstração local:</strong> 8 registos fictícios iniciais · Persistência em{' '}
              <code>localStorage</code> neste navegador
            </span>
          </div>
        </div>
      )}

      <main id="main-content" className="container main-content">
        {storageWarning && (
          <div className="warning-banner" role="alert">
            <span>{storageWarning}</span>
            <button
              type="button"
              className="btn btn-outline btn-sm"
              onClick={dismissStorageWarning}
            >
              Compreendi
            </button>
          </div>
        )}

        {currentView === 'home' && (
          <LandingPage onNavigate={handleSelectView} />
        )}
        {currentView === 'merchant' && (
          <MerchantPage onNavigate={handleSelectView} />
        )}
        {currentView === 'municipality' && <MunicipalityPage />}
        {currentView === 'citizen' && <CitizenPage />}
      </main>

      <footer className="site-footer">
        <div className="container footer-inner">
          <div className="footer-brand-line">
            <span className="footer-kicker">CASCAIS ACESSÍVEL</span>
            <span className="footer-divider" aria-hidden="true">
              ·
            </span>
            <span>
              Prova de conceito demonstrativa (dados locais em navegador, sem valor de certificação legal nem elegibilidade Portugal 2030).
            </span>
          </div>
          <p className="footer-sub">
            Cartografia © contribuidores do OpenStreetMap (requer ligação à Internet).
          </p>
        </div>
      </footer>
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <AppDataProvider>
      <AppShell />
    </AppDataProvider>
  );
};

export default App;
