import { CitizenReport, Establishment } from '../types';
import { isValidCoordinates } from './accessibility';

/**
 * Número explícito de campos/evidências avaliados por estabelecimento para o
 * Índice ilustrativo de prontidão documental (NÃO constitui elegibilidade oficial Portugal 2030):
 *
 * 1. Nome do estabelecimento preenchido
 * 2. Morada e localidade preenchidas
 * 3. Coordenadas geográficas válidas (latitude e longitude)
 * 4. Largura da entrada registada (> 0 cm)
 * 5. Indicação explícita sobre existência de degraus (Sim/Não)
 * 6. Evidência fotográfica da entrada anexada
 *
 * Fórmula:
 *   indiceProntidaoDocumental = (somaCamposPreenchidos / (totalEstabelecimentos * 6)) * 100
 *   (0% quando totalEstabelecimentos === 0)
 */
export const EXPECTED_DOCUMENT_FIELDS_PER_ESTABLISHMENT = 6;

export interface MunicipalityMetrics {
  totalEstablishments: number;
  accessibleCount: number;
  needsReviewCount: number;
  pendingCount: number;
  accessiblePercentage: number;
  documentReadinessPercentage: number;
  populatedDocumentFields: number;
  expectedDocumentFields: number;
  openReportsCount: number;
  resolvedReportsCount: number;
}

export function countPopulatedDocumentFields(est: Establishment): number {
  let count = 0;
  if (est.name.trim().length > 0) count += 1;
  if (est.address.trim().length > 0 && est.locality.trim().length > 0) count += 1;
  if (isValidCoordinates(est.latitude, est.longitude)) count += 1;
  if (
    est.entranceWidthCm !== null &&
    Number.isFinite(est.entranceWidthCm) &&
    est.entranceWidthCm > 0
  ) {
    count += 1;
  }
  if (est.hasSteps !== null) count += 1;
  if (Boolean(est.photoDataUrl)) count += 1;
  return count;
}

export function calculateMetrics(
  establishments: Establishment[],
  reports: CitizenReport[]
): MunicipalityMetrics {
  const totalEstablishments = establishments.length;
  const accessibleCount = establishments.filter(
    (e) => e.status === 'accessible'
  ).length;
  const needsReviewCount = establishments.filter(
    (e) => e.status === 'needs_review'
  ).length;
  const pendingCount = establishments.filter(
    (e) => e.status === 'pending'
  ).length;

  const accessiblePercentage =
    totalEstablishments === 0
      ? 0
      : Math.round((accessibleCount / totalEstablishments) * 1000) / 10;

  const expectedDocumentFields =
    totalEstablishments * EXPECTED_DOCUMENT_FIELDS_PER_ESTABLISHMENT;
  const populatedDocumentFields = establishments.reduce(
    (sum, est) => sum + countPopulatedDocumentFields(est),
    0
  );

  const documentReadinessPercentage =
    expectedDocumentFields === 0
      ? 0
      : Math.round((populatedDocumentFields / expectedDocumentFields) * 1000) / 10;

  const openReportsCount = reports.filter((r) => r.status === 'open').length;
  const resolvedReportsCount = reports.filter(
    (r) => r.status === 'resolved'
  ).length;

  return {
    totalEstablishments,
    accessibleCount,
    needsReviewCount,
    pendingCount,
    accessiblePercentage,
    documentReadinessPercentage,
    populatedDocumentFields,
    expectedDocumentFields,
    openReportsCount,
    resolvedReportsCount,
  };
}

export function formatPercentagePt(value: number): string {
  if (!Number.isFinite(value) || value === 0) return '0%';
  return Number.isInteger(value)
    ? `${value}%`
    : `${value.toFixed(1).replace('.', ',')}%`;
}
