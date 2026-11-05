import React from 'react';
import { AppView } from '../types';

interface NavigationProps {
  currentView: AppView;
  onSelectView: (view: AppView) => void;
  establishmentCount: number;
  openReportCount: number;
}

export const Navigation: React.FC<NavigationProps> = ({
  currentView,
  onSelectView,
  establishmentCount,
  openReportCount,
}) => {
  const navItems: Array<{
    id: AppView;
    code?: string;
    label: string;
    badge?: string;
    badgeTone?: 'teal' | 'coral';
  }> = [
    {
      id: 'home',
      label: 'Início',
    },
    {
      id: 'citizen',
      code: '01',
      label: 'Cidadão',
      badge: `${establishmentCount}`,
      badgeTone: 'teal',
    },
    {
      id: 'merchant',
      code: '02',
      label: 'Comerciante',
    },
    {
      id: 'municipality',
      code: '03',
      label: 'Autarquia',
      badge: openReportCount > 0 ? `${openReportCount}` : undefined,
      badgeTone: 'coral',
    },
  ];

  return (
    <header className="site-header">
      <div className="header-inner">
        <button
          type="button"
          className="brand-home-btn"
          onClick={() => onSelectView('home')}
          aria-label="Cascais Acessível — Voltar à página inicial"
        >
          <span className="brand-emblem" aria-hidden="true">
            <span className="brand-emblem-dot" />
          </span>
          <span className="brand-text-group">
            <span className="brand-title-row">
              <span className="brand-title">Cascais Acessível</span>
              <span className="poc-pill">PoC</span>
            </span>
            <span className="brand-subtitle">
              Serviço público demonstrativo · Armazenamento local
            </span>
          </span>
        </button>

        <nav className="main-nav" aria-label="Navegação entre portais">
          {navItems.map((item) => {
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                type="button"
                className={`nav-tab ${isActive ? 'active' : ''}`}
                aria-current={isActive ? 'page' : undefined}
                onClick={() => onSelectView(item.id)}
              >
                {item.code && (
                  <span className="nav-tab-code" aria-hidden="true">
                    {item.code}
                  </span>
                )}
                <span className="nav-tab-label">{item.label}</span>
                {item.badge && (
                  <span
                    className={`nav-tab-badge ${
                      item.badgeTone === 'coral' ? 'badge-coral' : 'badge-teal'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
