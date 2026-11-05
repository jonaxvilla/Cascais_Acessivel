import { Establishment } from '../types';
import { getStatusLabel } from './accessibility';

export function escapeCsvCell(
  value: string | number | boolean | null | undefined
): string {
  if (value === null || value === undefined) {
    return '';
  }
  const str = String(value);
  if (/[",\r\n;]/.test(str)) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

export function buildEstablishmentsCsvContent(
  establishments: Establishment[]
): string {
  const headers = [
    'ID',
    'Nome do Estabelecimento',
    'Morada',
    'Localidade',
    'Latitude',
    'Longitude',
    'Largura da Entrada (cm)',
    'Degraus na Entrada',
    'Fotografia Guardada',
    'Avaliação Preliminar (Ilustrativa)',
    'Origem do Registo',
    'Data de Registo (ISO)',
  ];

  const rows = establishments.map((est) => {
    const stepsText =
      est.hasSteps === null ? 'Não indicado' : est.hasSteps ? 'Sim' : 'Não';
    const widthText =
      est.entranceWidthCm !== null && Number.isFinite(est.entranceWidthCm)
        ? est.entranceWidthCm
        : 'Não indicada';
    const photoText = est.photoDataUrl ? 'Sim' : 'Não';
    const originText = est.isDemoData
      ? 'Dados fictícios (demonstração)'
      : 'Registo local (prova de conceito)';

    return [
      est.id,
      est.name,
      est.address,
      est.locality,
      est.latitude.toFixed(6),
      est.longitude.toFixed(6),
      widthText,
      stepsText,
      photoText,
      getStatusLabel(est.status),
      originText,
      est.createdAt,
    ]
      .map(escapeCsvCell)
      .join(',');
  });

  // BOM UTF-8 (\uFEFF) para compatibilidade direta com folhas de cálculo
  return '\uFEFF' + [headers.map(escapeCsvCell).join(','), ...rows].join('\r\n');
}

export function downloadEstablishmentsCsv(
  establishments: Establishment[]
): void {
  const csvContent = buildEstablishmentsCsvContent(establishments);
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const datePart = new Date().toISOString().slice(0, 10);

  const link = document.createElement('a');
  link.href = url;
  link.download = `cascais-acessivel-relatorio-demonstrativo-${datePart}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
