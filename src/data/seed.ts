import { CitizenReport, Establishment } from '../types';
import { evaluateAccessibility } from '../lib/accessibility';

/**
 * Oito registos estritamente fictícios distribuídos por Cascais, Estoril, Parede e Carcavelos.
 * Apenas carregados na primeira execução caso a chave de armazenamento não exista.
 */
const rawSeedEstablishments: Array<Omit<Establishment, 'status'>> = [
  {
    id: 'seed-cascais-1',
    name: 'Livraria Maré Viva (Fictício)',
    address: 'Rua Direita Fictícia, n.º 14 (Dados fictícios)',
    locality: 'Cascais',
    latitude: 38.6992,
    longitude: -9.4218,
    entranceWidthCm: 92,
    hasSteps: false,
    createdAt: '2026-10-28T09:15:00.000Z',
    isDemoData: true,
  },
  {
    id: 'seed-cascais-2',
    name: 'Pastelaria Farol Antigo (Fictício)',
    address: 'Largo Exemplo da Vila, n.º 3 (Dados fictícios)',
    locality: 'Cascais',
    latitude: 38.7016,
    longitude: -9.4191,
    entranceWidthCm: 74,
    hasSteps: true,
    createdAt: '2026-10-29T11:30:00.000Z',
    isDemoData: true,
  },
  {
    id: 'seed-estoril-1',
    name: 'Farmácia Jardim do Sol (Fictício)',
    address: 'Avenida Fictícia das Acácias, n.º 42 (Dados fictícios)',
    locality: 'Estoril',
    latitude: 38.7058,
    longitude: -9.3974,
    entranceWidthCm: 105,
    hasSteps: false,
    createdAt: '2026-10-30T10:05:00.000Z',
    isDemoData: true,
  },
  {
    id: 'seed-estoril-2',
    name: 'Galeria Atlântica (Fictício)',
    address: 'Rua Exemplo do Parque, n.º 8 (Dados fictícios)',
    locality: 'Estoril',
    latitude: 38.7074,
    longitude: -9.3918,
    entranceWidthCm: null,
    hasSteps: null,
    createdAt: '2026-10-31T14:20:00.000Z',
    isDemoData: true,
  },
  {
    id: 'seed-parede-1',
    name: 'Mercearia Bairro Central (Fictício)',
    address: 'Rua Fictícia da Estação, n.º 21 (Dados fictícios)',
    locality: 'Parede',
    latitude: 38.6908,
    longitude: -9.3558,
    entranceWidthCm: 88,
    hasSteps: false,
    createdAt: '2026-11-01T09:45:00.000Z',
    isDemoData: true,
  },
  {
    id: 'seed-parede-2',
    name: ' Óptica Miradouro (Fictício)'.trim(),
    address: 'Avenida Exemplo Central, n.º 67 (Dados fictícios)',
    locality: 'Parede',
    latitude: 38.6924,
    longitude: -9.3519,
    entranceWidthCm: 84,
    hasSteps: true,
    createdAt: '2026-11-02T16:10:00.000Z',
    isDemoData: true,
  },
  {
    id: 'seed-carcavelos-1',
    name: 'Padaria Trigo Dourado (Fictício)',
    address: 'Pracetas Fictícias do Junqueiro, n.º 5 (Dados fictícios)',
    locality: 'Carcavelos',
    latitude: 38.6887,
    longitude: -9.3356,
    entranceWidthCm: 95,
    hasSteps: false,
    createdAt: '2026-11-03T08:50:00.000Z',
    isDemoData: true,
  },
  {
    id: 'seed-carcavelos-2',
    name: 'Papelaria Vento Sul (Fictício)',
    address: 'Rua Exemplo do Comércio, n.º 19 (Dados fictícios)',
    locality: 'Carcavelos',
    latitude: 38.6911,
    longitude: -9.3314,
    entranceWidthCm: 72,
    hasSteps: false,
    createdAt: '2026-11-04T15:00:00.000Z',
    isDemoData: true,
  },
];

export const SEED_ESTABLISHMENTS: Establishment[] = rawSeedEstablishments.map(
  (item) => ({
    ...item,
    status: evaluateAccessibility(item.entranceWidthCm, item.hasSteps),
  })
);

export const SEED_REPORTS: CitizenReport[] = [
  {
    id: 'seed-report-1',
    establishmentId: 'seed-parede-2',
    description:
      '[Dados fictícios] Existe um degrau de aproximadamente 6 cm junto à soleira sem rampa amovível visível.',
    status: 'open',
    createdAt: '2026-11-04T17:30:00.000Z',
    isDemoData: true,
  },
];
