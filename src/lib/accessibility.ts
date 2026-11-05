import { AccessibilityStatus } from '../types';

export const DEMO_WIDTH_THRESHOLD_CM = 80;

export function evaluateAccessibility(
  widthCm: number | null,
  hasSteps: boolean | null
): AccessibilityStatus {
  if (
    widthCm === null ||
    !Number.isFinite(widthCm) ||
    widthCm <= 0 ||
    hasSteps === null
  ) {
    return 'pending';
  }

  return widthCm >= DEMO_WIDTH_THRESHOLD_CM && hasSteps === false
    ? 'accessible'
    : 'needs_review';
}

export const STATUS_LABELS: Record<AccessibilityStatus, string> = {
  accessible: 'Acessível — avaliação preliminar',
  needs_review: 'Requer avaliação',
  pending: 'Pendente',
};

export const STATUS_SYMBOLS: Record<AccessibilityStatus, string> = {
  accessible: '✓',
  needs_review: '!',
  pending: '?',
};

export function getStatusLabel(status: AccessibilityStatus): string {
  return STATUS_LABELS[status];
}

export function getStatusSymbol(status: AccessibilityStatus): string {
  return STATUS_SYMBOLS[status];
}

export function isValidCoordinates(latitude: number, longitude: number): boolean {
  return (
    Number.isFinite(latitude) &&
    Number.isFinite(longitude) &&
    latitude >= -90 &&
    latitude <= 90 &&
    longitude >= -180 &&
    longitude <= 180
  );
}

export function generateId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return `id-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}
