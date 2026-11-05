import React from 'react';
import { useAppData } from '../context/AppDataContext';
import { StatusBadge } from '../components/StatusBadge';
import {
  calculateMetrics,
  EXPECTED_DOCUMENT_FIELDS_PER_ESTABLISHMENT,
  formatPercentagePt,
} from '../lib/metrics';
import { downloadEstablishmentsCsv } from '../lib/exportCsv';

function formatDatePt(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return date.toLocaleDateString('pt-PT', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

export const MunicipalityPage: React.FC = () => {
  const { establishments, reports, resolveReport } = useAppData();
  const metrics = calculateMetrics(establishments, reports);

  const establishmentNameById = new Map(
    establishments.map((est) => [est.id, est.name])
  );

  return (
    <section className="page-section" aria-labelledby="municipality-heading">
      <div className="section-intro section-intro-split">
        <div>
          <span className="eyebrow-kicker">03 · PORTAL DA AUTARQUIA</span>
          <h2 id="municipality-heading">
            Coordenar, monitorizar e promover
          </h2>
          <p>
            Acompanhe os espaços registados, indicadores agregados em tempo real, participações cívicas e exporte um relatório CSV demonstrativo.
          </p>
        </div>

        <div className="export-action-block">
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => downloadEstablishmentsCsv(establishments)}
          >
            Exportar relatório CSV
          </button>
          <span className="export-disclaimer">
            Ficheiro demonstrativo (UTF-8) — não constitui candidatura oficial.
          </span>
        </div>
      </div>

      <div className="kpi-grid" aria-label="Indicadores-chave">
        <article className="kpi-card">
          <span className="kpi-label">Total de espaços registados</span>
          <strong className="kpi-value">{metrics.totalEstablishments}</strong>
          <span className="kpi-detail">
            {metrics.accessibleCount} acessíveis · {metrics.needsReviewCount} a avaliar ·{' '}
            {metrics.pendingCount} pendentes
          </span>
        </article>

        <article className="kpi-card">
          <span className="kpi-label">% com avaliação preliminar acessível</span>
          <strong className="kpi-value kpi-value-green">
            {formatPercentagePt(metrics.accessiblePercentage)}
          </strong>
          <span className="kpi-detail">
            Critério demonstrativo: largura ≥ 80 cm e sem degraus (sem valor certificador)
          </span>
        </article>

        <article className="kpi-card">
          <span className="kpi-label">
            Índice ilustrativo de prontidão documental
          </span>
          <strong className="kpi-value">
            {formatPercentagePt(metrics.documentReadinessPercentage)}
          </strong>
          <span className="kpi-detail">
            {metrics.populatedDocumentFields} de {metrics.expectedDocumentFields} campos/evidências preenchidos ({EXPECTED_DOCUMENT_FIELDS_PER_ESTABLISHMENT} por espaço).{' '}
            <strong>Não representa elegibilidade Portugal 2030.</strong>
          </span>
        </article>

        <article className="kpi-card">
          <span className="kpi-label">Reportes abertos</span>
          <strong
            className={`kpi-value ${metrics.openReportsCount > 0 ? 'kpi-value-amber' : ''}`}
          >
            {metrics.openReportsCount}
          </strong>
          <span className="kpi-detail">
            {metrics.resolvedReportsCount}{' '}
            {metrics.resolvedReportsCount === 1
              ? 'reporte resolvido'
              : 'reportes resolvidos'}{' '}
            no total
          </span>
        </article>
      </div>

      <div className="card section-block">
        <div className="block-header">
          <div>
            <h3>Estabelecimentos Registados ({establishments.length})</h3>
            <p className="block-subtitle">
              Os registos iniciais assinalados como «Dados fictícios» servem exclusivamente para demonstração da prova de conceito.
            </p>
          </div>
        </div>

        {establishments.length === 0 ? (
          <p className="empty-state">
            Ainda não existem estabelecimentos registados neste navegador.
          </p>
        ) : (
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th scope="col">Estabelecimento</th>
                  <th scope="col">Localidade</th>
                  <th scope="col">Largura da entrada</th>
                  <th scope="col">Degraus</th>
                  <th scope="col">Avaliação preliminar</th>
                  <th scope="col">Data</th>
                </tr>
              </thead>
              <tbody>
                {establishments.map((est) => (
                  <tr key={est.id}>
                    <td>
                      <div className="table-primary-cell">
                        <strong>{est.name}</strong>
                        {est.isDemoData && (
                          <span className="demo-tag">Dados fictícios</span>
                        )}
                      </div>
                      <span className="table-secondary-text">{est.address}</span>
                    </td>
                    <td>{est.locality}</td>
                    <td>
                      {est.entranceWidthCm !== null
                        ? `${est.entranceWidthCm} cm`
                        : 'Não indicada'}
                    </td>
                    <td>
                      {est.hasSteps === null
                        ? 'Não indicado'
                        : est.hasSteps
                          ? 'Sim'
                          : 'Não'}
                    </td>
                    <td>
                      <StatusBadge status={est.status} />
                    </td>
                    <td>{formatDatePt(est.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="card section-block">
        <div className="block-header">
          <div>
            <h3>Reportes da Comunidade ({reports.length})</h3>
            <p className="block-subtitle">
              As participações cívicas sinalizam potenciais inconsistências para verificação técnica, sem alterar automaticamente a avaliação do estabelecimento.
            </p>
          </div>
        </div>

        {reports.length === 0 ? (
          <p className="empty-state">
            Não existem reportes submetidos até ao momento.
          </p>
        ) : (
          <ul className="reports-list">
            {reports.map((report) => {
              const estName =
                establishmentNameById.get(report.establishmentId) ??
                'Estabelecimento não encontrado';
              const isOpen = report.status === 'open';

              return (
                <li
                  key={report.id}
                  className={`report-item ${isOpen ? 'report-open' : 'report-resolved'}`}
                >
                  <div className="report-main">
                    <div className="report-meta-top">
                      <strong>{estName}</strong>
                      {report.isDemoData && (
                        <span className="demo-tag">Dados fictícios</span>
                      )}
                      <span
                        className={`report-status-pill ${isOpen ? 'pill-open' : 'pill-resolved'}`}
                      >
                        {isOpen ? 'Aberto' : 'Resolvido'}
                      </span>
                      <span className="report-date">
                        {formatDatePt(report.createdAt)}
                      </span>
                    </div>
                    <p className="report-description">{report.description}</p>
                  </div>

                  {isOpen && (
                    <div className="report-actions">
                      <button
                        type="button"
                        className="btn btn-outline btn-sm"
                        onClick={() => resolveReport(report.id)}
                      >
                        Marcar como resolvido
                      </button>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </section>
  );
};
