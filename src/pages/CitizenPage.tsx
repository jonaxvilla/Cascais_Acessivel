import React, { useState } from 'react';
import { useAppData } from '../context/AppDataContext';
import { EstablishmentMap } from '../components/EstablishmentMap';
import { ReportModal } from '../components/ReportModal';
import { StatusBadge } from '../components/StatusBadge';
import { Establishment } from '../types';
import { getStatusLabel, getStatusSymbol } from '../lib/accessibility';

type CitizenFilter = 'all' | 'accessible' | 'needs_review' | 'pending';

export const CitizenPage: React.FC = () => {
  const { establishments, addReport } = useAppData();
  const [activeFilter, setActiveFilter] = useState<CitizenFilter>('all');
  const [reportingEstablishment, setReportingEstablishment] =
    useState<Establishment | null>(null);
  const [reportConfirmation, setReportConfirmation] = useState<string | null>(
    null
  );

  const filteredEstablishments = establishments.filter((est) => {
    if (activeFilter === 'all') return true;
    return est.status === activeFilter;
  });

  const counts = {
    all: establishments.length,
    accessible: establishments.filter((e) => e.status === 'accessible').length,
    needs_review: establishments.filter((e) => e.status === 'needs_review')
      .length,
    pending: establishments.filter((e) => e.status === 'pending').length,
  };

  const handleSubmitReport = (establishmentId: string, description: string) => {
    addReport(establishmentId, description);
    const targetName =
      establishments.find((e) => e.id === establishmentId)?.name ??
      'o estabelecimento selecionado';
    setReportingEstablishment(null);
    setReportConfirmation(
      `Reporte submetido com sucesso para «${targetName}». Já se encontra visível na vista da Autarquia.`
    );
  };

  return (
    <section className="page-section" aria-labelledby="citizen-heading">
      <div className="section-intro">
        <div>
          <span className="eyebrow-kicker">01 · PORTAL DO CIDADÃO</span>
          <h2 id="citizen-heading">
            Descobrir com confiança no mapa público
          </h2>
          <p>
            Explore os estabelecimentos comerciais no mapa de Cascais, filtre por avaliação preliminar, consulte os detalhes de cada entrada e reporte eventuais inconsistências.
          </p>
        </div>
      </div>

      {reportConfirmation && (
        <div className="confirmation-card confirmation-compact" role="status">
          <span>{reportConfirmation}</span>
          <button
            type="button"
            className="btn btn-outline btn-sm"
            onClick={() => setReportConfirmation(null)}
          >
            Fechar aviso
          </button>
        </div>
      )}

      <div className="card map-controls-card">
        <div className="filter-bar" role="group" aria-label="Filtrar por estado de avaliação">
          <span className="filter-label">Filtrar espaços:</span>
          <div className="filter-buttons">
            <button
              type="button"
              className={`filter-btn ${activeFilter === 'all' ? 'active' : ''}`}
              aria-pressed={activeFilter === 'all'}
              onClick={() => setActiveFilter('all')}
            >
              Todos ({counts.all})
            </button>
            <button
              type="button"
              className={`filter-btn ${activeFilter === 'accessible' ? 'active' : ''}`}
              aria-pressed={activeFilter === 'accessible'}
              onClick={() => setActiveFilter('accessible')}
            >
              Acessíveis ({counts.accessible})
            </button>
            <button
              type="button"
              className={`filter-btn ${activeFilter === 'needs_review' ? 'active' : ''}`}
              aria-pressed={activeFilter === 'needs_review'}
              onClick={() => setActiveFilter('needs_review')}
            >
              A avaliar ({counts.needs_review})
            </button>
            <button
              type="button"
              className={`filter-btn ${activeFilter === 'pending' ? 'active' : ''}`}
              aria-pressed={activeFilter === 'pending'}
              onClick={() => setActiveFilter('pending')}
            >
              Pendentes ({counts.pending})
            </button>
          </div>
        </div>

        <div className="map-legend" aria-label="Legenda do mapa">
          <div className="legend-item">
            <span className="legend-pin legend-pin-accessible" aria-hidden="true">
              {getStatusSymbol('accessible')}
            </span>
            <span>
              <strong>{getStatusLabel('accessible')}</strong> (≥ 80 cm, sem degraus)
            </span>
          </div>
          <div className="legend-item">
            <span className="legend-pin legend-pin-needs_review" aria-hidden="true">
              {getStatusSymbol('needs_review')}
            </span>
            <span>
              <strong>{getStatusLabel('needs_review')}</strong> (&lt; 80 cm ou com degraus)
            </span>
          </div>
          <div className="legend-item">
            <span className="legend-pin legend-pin-pending" aria-hidden="true">
              {getStatusSymbol('pending')}
            </span>
            <span>
              <strong>{getStatusLabel('pending')}</strong> (dados incompletos)
            </span>
          </div>
        </div>

        <EstablishmentMap
          establishments={filteredEstablishments}
          onReportEstablishment={(est) => setReportingEstablishment(est)}
        />

        <p className="map-footer-note">
          Clique num marcador colorido para consultar os dados da entrada e reportar inconsistências. O carregamento dos mosaicos cartográficos OpenStreetMap requer ligação à Internet.
        </p>
      </div>

      <div className="card section-block">
        <div className="block-header">
          <div>
            <h3>
              Lista Acessível de Espaços Filtrados ({filteredEstablishments.length})
            </h3>
            <p className="block-subtitle">
              Alternativa textual aos marcadores do mapa. Os registos iniciais são dados fictícios de demonstração.
            </p>
          </div>
        </div>

        {filteredEstablishments.length === 0 ? (
          <p className="empty-state">
            Nenhum estabelecimento corresponde ao filtro selecionado.
          </p>
        ) : (
          <div className="citizen-cards-grid">
            {filteredEstablishments.map((est) => (
              <article key={est.id} className="citizen-est-card">
                <div className="citizen-est-header">
                  <div>
                    <h4>{est.name}</h4>
                    {est.isDemoData && (
                      <span className="demo-tag">Dados fictícios</span>
                    )}
                  </div>
                  <StatusBadge status={est.status} />
                </div>
                <p className="citizen-est-address">
                  {est.address} — <strong>{est.locality}</strong>
                </p>
                <p className="citizen-est-specs">
                  Largura:{' '}
                  <strong>
                    {est.entranceWidthCm !== null
                      ? `${est.entranceWidthCm} cm`
                      : 'Não indicada'}
                  </strong>{' '}
                  · Degraus:{' '}
                  <strong>
                    {est.hasSteps === null
                      ? 'Não indicado'
                      : est.hasSteps
                        ? 'Sim'
                        : 'Não'}
                  </strong>
                </p>
                <button
                  type="button"
                  className="btn btn-outline btn-sm"
                  onClick={() => setReportingEstablishment(est)}
                >
                  Reportar inconsistência
                </button>
              </article>
            ))}
          </div>
        )}
      </div>

      <ReportModal
        establishment={reportingEstablishment}
        onClose={() => setReportingEstablishment(null)}
        onSubmit={handleSubmitReport}
      />
    </section>
  );
};
