import React, { useState } from 'react';
import { useAppData } from '../context/AppDataContext';
import { EstablishmentMap } from '../components/EstablishmentMap';
import { ReportModal } from '../components/ReportModal';
import {
  LocationPinIcon,
  MunicipalityHallIcon,
  ReviewedCheckIcon,
  StepFreeIcon,
  StorefrontIcon,
  WheelchairIcon,
  WideDoorIcon,
} from '../components/Icons';
import { getStatusLabel, getStatusSymbol } from '../lib/accessibility';
import { calculateMetrics, formatPercentagePt } from '../lib/metrics';
import { AppView, Establishment } from '../types';

interface LandingPageProps {
  onNavigate: (view: AppView) => void;
}

type AudienceKey = 'citizen' | 'merchant' | 'municipality';
type StatusFilter = 'all' | 'accessible' | 'needs_review' | 'pending';

interface AudienceConfig {
  key: AudienceKey;
  number: string;
  eyebrow: string;
  needLabel: string;
  needHint: string;
  cardTitle: string;
  cardDescription: string;
  ctaLabel: string;
  emphasis: string;
  journey: string[];
}

const AUDIENCES: AudienceConfig[] = [
  {
    key: 'citizen',
    number: '01',
    eyebrow: 'PORTAL DO CIDADÃO',
    needLabel: 'Procurar um espaço acessível',
    needHint: 'Consultar entradas sem degraus, larguras de porta e reportar obstáculos.',
    cardTitle: 'Descobrir com confiança',
    cardDescription:
      'Encontre restaurantes, cafés e comércio local por localização e características físicas medidas.',
    ctaLabel: 'Explorar portal do cidadão',
    emphasis: 'Mapa interativo + filtros + participação cívica',
    journey: [
      'Explorar espaços próximos no mapa de Cascais',
      'Consultar largura da porta e existência de degraus',
      'Reportar inconsistências observadas no local',
    ],
  },
  {
    key: 'merchant',
    number: '02',
    eyebrow: 'PORTAL DO COMERCIANTE',
    needLabel: 'Registar o meu estabelecimento',
    needHint: 'Partilhar medidas da entrada, fotografia e localização no mapa.',
    cardTitle: 'Registar e dar visibilidade',
    cardDescription:
      'Descreva de forma simples os dados objetivos da sua entrada e obtenha avaliação preliminar imediata.',
    ctaLabel: 'Registar estabelecimento',
    emphasis: 'Formulário guiado + avaliação preliminar + mapa',
    journey: [
      'Registar nome, morada e localidade do espaço',
      'Indicar largura útil em cm, degraus e fotografia opcional',
      'Assinalar posição exata no mapa com avaliação imediata',
    ],
  },
  {
    key: 'municipality',
    number: '03',
    eyebrow: 'PORTAL DA AUTARQUIA',
    needLabel: 'Monitorizar dados e reportes',
    needHint: 'Acompanhar indicadores concelhios, alertas cívicos e exportar CSV.',
    cardTitle: 'Coordenar e promover',
    cardDescription:
      'Analise a cobertura geográfica, acompanhe participações da comunidade e exporte dados estruturados.',
    ctaLabel: 'Abrir painel da autarquia',
    emphasis: 'Indicadores em tempo real + evidências + exportação CSV',
    journey: [
      'Acompanhar métricas agregadas e prontidão documental',
      'Rever e resolver reportes submetidos pelos cidadãos',
      'Exportar relatório demonstrativo em formato CSV',
    ],
  },
];

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigate }) => {
  const { establishments, reports, addReport } = useAppData();
  const [selectedAudience, setSelectedAudience] =
    useState<AudienceKey>('citizen');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [localityFilter, setLocalityFilter] = useState<string>('all');
  const [reportingEstablishment, setReportingEstablishment] =
    useState<Establishment | null>(null);
  const [reportFeedback, setReportFeedback] = useState<string | null>(null);

  const metrics = calculateMetrics(establishments, reports);
  const activeAudience =
    AUDIENCES.find((item) => item.key === selectedAudience) ?? AUDIENCES[0];

  const localityOptions = [
    { id: 'all', label: 'Todo o concelho' },
    { id: 'cascais', label: 'Cascais' },
    { id: 'estoril', label: 'Estoril' },
    { id: 'parede', label: 'Parede' },
    { id: 'carcavelos', label: 'Carcavelos' },
  ];

  const filteredEstablishments = establishments.filter((est) => {
    const matchesStatus =
      statusFilter === 'all' ? true : est.status === statusFilter;
    const matchesLocality =
      localityFilter === 'all'
        ? true
        : est.locality.toLowerCase().includes(localityFilter);
    return matchesStatus && matchesLocality;
  });

  const statusCounts = {
    all: establishments.length,
    accessible: establishments.filter((e) => e.status === 'accessible').length,
    needs_review: establishments.filter((e) => e.status === 'needs_review')
      .length,
    pending: establishments.filter((e) => e.status === 'pending').length,
  };

  const handleScrollToMap = () => {
    const el = document.getElementById('landing-live-map');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleSubmitReport = (establishmentId: string, description: string) => {
    addReport(establishmentId, description);
    const targetName =
      establishments.find((e) => e.id === establishmentId)?.name ??
      'o espaço selecionado';
    setReportingEstablishment(null);
    setReportFeedback(
      `Reporte registado para «${targetName}». Já está disponível para revisão no Portal da Autarquia.`
    );
  };

  const renderAudienceIcon = (key: AudienceKey, size = 28) => {
    if (key === 'citizen') return <LocationPinIcon size={size} />;
    if (key === 'merchant') return <StorefrontIcon size={size} />;
    return <MunicipalityHallIcon size={size} />;
  };

  return (
    <div className="landing-page">
      {/* HERO SECTION */}
      <section className="landing-hero" aria-labelledby="landing-display-title">
        <div className="hero-header-copy">
          <div className="eyebrow-row">
            <span className="eyebrow-kicker">
              SERVIÇO PÚBLICO · CASCAIS ACESSÍVEL
            </span>
            <span className="eyebrow-meta">PROVA DE CONCEITO · V1.0</span>
          </div>
          <h2 id="landing-display-title" className="display-title">
            A acessibilidade é mais simples quando a informação é clara.
          </h2>
          <p className="display-lead">
            Uma linguagem visual ligada para encontrar estabelecimentos acessíveis,
            registar entradas comerciais e construir um concelho mais inclusivo.
          </p>
        </div>

        <div className="hero-bento-grid">
          {/* HERO ILLUSTRATION CARD */}
          <div className="hero-visual-card">
            <div className="hero-image-frame">
              <img
                src="/hero-illustration.jpg"
                alt="Ilustração de percursos urbanos acessíveis a verde e mostarda ligando cafés, bistrôs e restaurantes a pessoas em cadeira de rodas, peões e ciclistas."
                className="hero-illustration-img"
              />
            </div>

            <div className="hero-live-strip" aria-label="Resumo em tempo real">
              <div className="hero-stat-pill">
                <WheelchairIcon size={18} />
                <span>
                  <strong>{metrics.totalEstablishments}</strong> espaços no mapa
                </span>
              </div>
              <div className="hero-stat-pill">
                <StepFreeIcon size={18} />
                <span>
                  <strong>
                    {formatPercentagePt(metrics.accessiblePercentage)}
                  </strong>{' '}
                  sem degraus (≥ 80 cm)
                </span>
              </div>
              <div className="hero-stat-pill">
                <WideDoorIcon size={18} />
                <button
                  type="button"
                  className="inline-map-jump"
                  onClick={handleScrollToMap}
                >
                  Ver mapa atualizado ↓
                </button>
              </div>
            </div>
          </div>

          {/* INTERACTIVE NEED GUIDE CARD ("THE SHARED PROMISE") */}
          <div className="hero-guide-card" aria-label="Guia rápido por perfil">
            <span className="eyebrow-kicker">ESCOLHA O SEU PERCURSO</span>
            <h3 className="guide-heading">Como podemos ajudar hoje?</h3>
            <p className="guide-subtext">
              Selecione a sua necessidade para aceder diretamente ao portal adequado:
            </p>

            <div
              className="need-selector-list"
              role="tablist"
              aria-label="Selecionar perfil de utilizador"
            >
              {AUDIENCES.map((aud, idx) => {
                const isSelected = selectedAudience === aud.key;
                return (
                  <button
                    key={aud.key}
                    id={`need-tab-${aud.key}`}
                    type="button"
                    role="tab"
                    aria-selected={isSelected}
                    aria-controls="need-active-panel"
                    className={`need-option-btn ${isSelected ? 'selected' : ''}`}
                    onClick={() => setSelectedAudience(aud.key)}
                    onKeyDown={(e) => {
                      if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
                        e.preventDefault();
                        const next = AUDIENCES[(idx + 1) % AUDIENCES.length];
                        setSelectedAudience(next.key);
                        document.getElementById(`need-tab-${next.key}`)?.focus();
                      } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
                        e.preventDefault();
                        const prev =
                          AUDIENCES[
                            (idx - 1 + AUDIENCES.length) % AUDIENCES.length
                          ];
                        setSelectedAudience(prev.key);
                        document.getElementById(`need-tab-${prev.key}`)?.focus();
                      }
                    }}
                  >
                    <span className="need-option-icon">
                      {renderAudienceIcon(aud.key, 28)}
                    </span>
                    <span className="need-option-text">
                      <span className="need-option-title">
                        <span className="need-number">{aud.number}</span>{' '}
                        {aud.needLabel}
                      </span>
                      <span className="need-option-desc">{aud.needHint}</span>
                    </span>
                  </button>
                );
              })}
            </div>

            <div
              id="need-active-panel"
              className="guide-active-callout"
              role="tabpanel"
              aria-labelledby={`need-tab-${activeAudience.key}`}
            >
              <div className="guide-callout-meta">
                <span>{activeAudience.eyebrow}</span>
                {activeAudience.key === 'municipality' &&
                  metrics.openReportsCount > 0 && (
                    <span className="coral-pill">
                      {metrics.openReportsCount}{' '}
                      {metrics.openReportsCount === 1
                        ? 'reporte aberto'
                        : 'reportes abertos'}
                    </span>
                  )}
              </div>

              <button
                type="button"
                className="btn btn-primary btn-cta-arrow btn-full"
                onClick={() => onNavigate(activeAudience.key)}
              >
                <span>{activeAudience.ctaLabel}</span>
                <span aria-hidden="true">→</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* THREE PORTALS / ONE SYSTEM */}
      <section
        className="landing-portals-section"
        aria-labelledby="portals-section-heading"
      >
        <div className="section-heading-compact">
          <span className="eyebrow-kicker">TRÊS PÚBLICOS · UM SISTEMA</span>
          <h3 id="portals-section-heading">
            Três portais ligados pelos mesmos dados em tempo real
          </h3>
        </div>

        <div className="portals-three-grid">
          {AUDIENCES.map((aud) => {
            const isHighlighted = selectedAudience === aud.key;
            return (
              <article
                key={aud.key}
                className={`portal-pathway-card ${isHighlighted ? 'highlighted' : ''}`}
                onMouseEnter={() => setSelectedAudience(aud.key)}
              >
                <div className="portal-card-top">
                  <span className="portal-index">{aud.number}</span>
                  <span className="portal-eyebrow">{aud.eyebrow}</span>
                </div>

                <div className="portal-title-row">
                  {renderAudienceIcon(aud.key, 32)}
                  <h4>{aud.cardTitle}</h4>
                </div>

                <p className="portal-card-desc">{aud.cardDescription}</p>

                <ul className="portal-journey-list">
                  {aud.journey.map((step) => (
                    <li key={step}>
                      <ReviewedCheckIcon size={18} />
                      <span>{step}</span>
                    </li>
                  ))}
                </ul>

                <div className="portal-card-footer">
                  <span className="portal-emphasis-note">{aud.emphasis}</span>
                  <button
                    type="button"
                    className={
                      isHighlighted
                        ? 'btn btn-primary btn-cta-arrow btn-full'
                        : 'btn btn-secondary-teal btn-cta-arrow btn-full'
                    }
                    onClick={() => onNavigate(aud.key)}
                  >
                    <span>{aud.ctaLabel}</span>
                    <span aria-hidden="true">→</span>
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* LIVE INTERACTIVE MAP PREVIEW */}
      <section
        id="landing-live-map"
        className="card landing-map-section"
        aria-labelledby="live-map-heading"
      >
        <div className="landing-map-header">
          <div>
            <span className="eyebrow-kicker">MAPA EM TEMPO REAL · CASCAIS</span>
            <h3 id="live-map-heading">
              Explore os espaços registados diretamente aqui
            </h3>
            <p className="block-subtitle">
              Qualquer registo efetuado no Portal do Comerciante surge imediatamente neste mapa. Clique num marcador para ver medidas da entrada ou reportar uma inconsistência.
            </p>
          </div>

          <div className="landing-map-header-actions">
            <button
              type="button"
              className="btn btn-secondary-teal"
              onClick={() => onNavigate('citizen')}
            >
              Vista completa do Cidadão
            </button>
            <button
              type="button"
              className="btn btn-primary btn-cta-arrow"
              onClick={() => onNavigate('merchant')}
            >
              <span>Registar espaço</span>
              <span aria-hidden="true">→</span>
            </button>
          </div>
        </div>

        {reportFeedback && (
          <div className="confirmation-card confirmation-compact" role="status">
            <span>{reportFeedback}</span>
            <div className="confirmation-inline-btns">
              <button
                type="button"
                className="btn btn-secondary-teal btn-sm"
                onClick={() => onNavigate('municipality')}
              >
                Ver na Autarquia
              </button>
              <button
                type="button"
                className="btn btn-outline btn-sm"
                onClick={() => setReportFeedback(null)}
              >
                Fechar
              </button>
            </div>
          </div>
        )}

        <div className="landing-filters-toolbar">
          <div
            className="filter-chips-row"
            role="group"
            aria-label="Filtrar mapa por avaliação preliminar"
          >
            <button
              type="button"
              className={`ds-chip ${statusFilter === 'all' ? 'active' : ''}`}
              aria-pressed={statusFilter === 'all'}
              onClick={() => setStatusFilter('all')}
            >
              Todos ({statusCounts.all})
            </button>
            <button
              type="button"
              className={`ds-chip ${statusFilter === 'accessible' ? 'active' : ''}`}
              aria-pressed={statusFilter === 'accessible'}
              onClick={() => setStatusFilter('accessible')}
            >
              <span aria-hidden="true">✓</span> Entrada acessível ≥ 80 cm (
              {statusCounts.accessible})
            </button>
            <button
              type="button"
              className={`ds-chip ${statusFilter === 'needs_review' ? 'active' : ''}`}
              aria-pressed={statusFilter === 'needs_review'}
              onClick={() => setStatusFilter('needs_review')}
            >
              <span aria-hidden="true">!</span> Requer avaliação (
              {statusCounts.needs_review})
            </button>
            <button
              type="button"
              className={`ds-chip ${statusFilter === 'pending' ? 'active' : ''}`}
              aria-pressed={statusFilter === 'pending'}
              onClick={() => setStatusFilter('pending')}
            >
              <span aria-hidden="true">?</span> Pendentes ({statusCounts.pending})
            </button>
          </div>

          <div
            className="filter-chips-row locality-chips-row"
            role="group"
            aria-label="Filtrar mapa por localidade"
          >
            {localityOptions.map((loc) => (
              <button
                key={loc.id}
                type="button"
                className={`ds-chip ds-chip-subtle ${localityFilter === loc.id ? 'active-subtle' : ''}`}
                aria-pressed={localityFilter === loc.id}
                onClick={() => setLocalityFilter(loc.id)}
              >
                {loc.label}
              </button>
            ))}
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
          <span className="legend-count-summary">
            A mostrar <strong>{filteredEstablishments.length}</strong> de{' '}
            {establishments.length} espaços
          </span>
        </div>

        <EstablishmentMap
          establishments={filteredEstablishments}
          onReportEstablishment={(est) => setReportingEstablishment(est)}
        />
      </section>

      {/* TRUST & PUBLICATION JOURNEY STRIP (PAGE 5 OF DESIGN SYSTEM) */}
      <section
        className="trust-journey-section"
        aria-labelledby="trust-section-heading"
      >
        <div className="section-heading-compact">
          <span className="eyebrow-kicker">
            QUALIDADE DO SERVIÇO · CONFIANÇA COMO COMPONENTE
          </span>
          <h3 id="trust-section-heading">
            Informação física específica, datada e transparente
          </h3>
        </div>

        <ol className="publication-steps-grid">
          <li className="pub-step-card">
            <div className="pub-step-top">
              <span className="pub-step-num">1</span>
              <strong>Registar</strong>
            </div>
            <p>
              O comerciante indica medidas observadas da entrada (largura em cm e degraus) e posição no mapa.
            </p>
          </li>
          <li className="pub-step-card">
            <div className="pub-step-top">
              <span className="pub-step-num">2</span>
              <strong>Avaliar</strong>
            </div>
            <p>
              Regras determinísticas atribuem um estado preliminar claro sem promessas vagas.
            </p>
          </li>
          <li className="pub-step-card">
            <div className="pub-step-top">
              <span className="pub-step-num">3</span>
              <strong>Publicar</strong>
            </div>
            <p>
              As características e a origem dos dados surgem de imediato no mapa público.
            </p>
          </li>
          <li className="pub-step-card">
            <div className="pub-step-top">
              <span className="pub-step-num">4</span>
              <strong>Manter</strong>
            </div>
            <p>
              Cidadãos reportam eventuais inconsistências para revisão no painel da Autarquia.
            </p>
          </li>
        </ol>

        <div className="ds-implementation-note" role="note">
          <strong>Nota de transparência:</strong> Um estabelecimento pode declarar características físicas da entrada; esta classificação preliminar (parâmetro demonstrativo de 80 cm) não constitui verificação técnica oficial nem certificação legal. Os 8 espaços iniciais são <strong>dados fictícios</strong> guardados localmente neste navegador.
        </div>
      </section>

      <ReportModal
        establishment={reportingEstablishment}
        onClose={() => setReportingEstablishment(null)}
        onSubmit={handleSubmitReport}
      />
    </div>
  );
};
