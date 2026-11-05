import { SEED_ESTABLISHMENTS, SEED_REPORTS } from '../data/seed';
import { evaluateAccessibility, isValidCoordinates } from './accessibility';
import { CitizenReport, Establishment } from '../types';

export const ESTABLISHMENTS_STORAGE_KEY = 'cascais-accessible:establishments:v1';
export const REPORTS_STORAGE_KEY = 'cascais-accessible:reports:v1';

export interface StorageLoadResult<T> {
  data: T;
  warning: string | null;
}

export interface StorageSaveResult {
  ok: boolean;
  savedWithoutPhoto?: boolean;
  warning: string | null;
}

function isValidEstablishmentRecord(item: unknown): item is Establishment {
  if (!item || typeof item !== 'object') return false;
  const rec = item as Record<string, unknown>;
  return (
    typeof rec.id === 'string' &&
    typeof rec.name === 'string' &&
    typeof rec.address === 'string' &&
    typeof rec.locality === 'string' &&
    typeof rec.latitude === 'number' &&
    typeof rec.longitude === 'number' &&
    isValidCoordinates(rec.latitude, rec.longitude) &&
    (rec.entranceWidthCm === null || typeof rec.entranceWidthCm === 'number') &&
    (rec.hasSteps === null || typeof rec.hasSteps === 'boolean') &&
    typeof rec.createdAt === 'string'
  );
}

function isValidReportRecord(item: unknown): item is CitizenReport {
  if (!item || typeof item !== 'object') return false;
  const rec = item as Record<string, unknown>;
  return (
    typeof rec.id === 'string' &&
    typeof rec.establishmentId === 'string' &&
    typeof rec.description === 'string' &&
    (rec.status === 'open' || rec.status === 'resolved') &&
    typeof rec.createdAt === 'string'
  );
}

export function loadEstablishments(): StorageLoadResult<Establishment[]> {
  try {
    const raw = window.localStorage.getItem(ESTABLISHMENTS_STORAGE_KEY);
    if (raw === null) {
      // Primeira execução: inserir 8 registos fictícios e gravar chave imediatamente
      // para nunca voltar a semear caso o utilizador limpe os registos.
      try {
        window.localStorage.setItem(
          ESTABLISHMENTS_STORAGE_KEY,
          JSON.stringify(SEED_ESTABLISHMENTS)
        );
      } catch {
        return {
          data: SEED_ESTABLISHMENTS,
          warning:
            'Não foi possível guardar os dados iniciais no armazenamento local deste navegador.',
        };
      }
      return { data: SEED_ESTABLISHMENTS, warning: null };
    }

    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      throw new Error('Formato inválido');
    }

    const sanitized = parsed
      .filter(isValidEstablishmentRecord)
      .map((item) => ({
        ...item,
        status: evaluateAccessibility(item.entranceWidthCm, item.hasSteps),
      }));

    return {
      data: sanitized,
      warning:
        sanitized.length < parsed.length
          ? 'Alguns registos locais com formato inválido foram ignorados.'
          : null,
    };
  } catch {
    return {
      data: SEED_ESTABLISHMENTS,
      warning:
        'Os dados locais de estabelecimentos estavam corrompidos ou indisponíveis. Foram carregados dados fictícios de demonstração em memória.',
    };
  }
}

export function saveEstablishments(
  establishments: Establishment[]
): StorageSaveResult {
  try {
    window.localStorage.setItem(
      ESTABLISHMENTS_STORAGE_KEY,
      JSON.stringify(establishments)
    );
    return { ok: true, warning: null };
  } catch {
    // Caso a quota de localStorage seja excedida devido às fotografias,
    // tentar guardar sem a fotografia do registo mais recente para nunca bloquear o registo.
    try {
      const stripped = establishments.map((item, idx) =>
        idx === 0 ? { ...item, photoDataUrl: undefined } : item
      );
      window.localStorage.setItem(
        ESTABLISHMENTS_STORAGE_KEY,
        JSON.stringify(stripped)
      );
      return {
        ok: true,
        savedWithoutPhoto: true,
        warning:
          'O limite de espaço do navegador foi atingido: o estabelecimento foi guardado sem a fotografia anexada.',
      };
    } catch {
      return {
        ok: false,
        warning:
          'Limite de armazenamento local (localStorage) atingido. Os dados permanecem visíveis nesta sessão, mas poderão não persistir após atualizar a página.',
      };
    }
  }
}

export function loadReports(): StorageLoadResult<CitizenReport[]> {
  try {
    const raw = window.localStorage.getItem(REPORTS_STORAGE_KEY);
    if (raw === null) {
      try {
        window.localStorage.setItem(
          REPORTS_STORAGE_KEY,
          JSON.stringify(SEED_REPORTS)
        );
      } catch {
        return {
          data: SEED_REPORTS,
          warning:
            'Não foi possível guardar os reportes iniciais no armazenamento local.',
        };
      }
      return { data: SEED_REPORTS, warning: null };
    }

    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      throw new Error('Formato inválido');
    }

    const sanitized = parsed.filter(isValidReportRecord);
    return {
      data: sanitized,
      warning:
        sanitized.length < parsed.length
          ? 'Alguns reportes locais com formato inválido foram ignorados.'
          : null,
    };
  } catch {
    return {
      data: [],
      warning:
        'Não foi possível ler os reportes guardados localmente devido a dados inválidos.',
    };
  }
}

export function saveReports(reports: CitizenReport[]): StorageSaveResult {
  try {
    window.localStorage.setItem(REPORTS_STORAGE_KEY, JSON.stringify(reports));
    return { ok: true, warning: null };
  } catch {
    return {
      ok: false,
      warning:
        'Não foi possível guardar o reporte no armazenamento local (quota excedida ou armazenamento bloqueado).',
    };
  }
}

/**
 * Redimensiona e comprime uma imagem no cliente (máx. 360 px, JPEG 0.65)
 * para caber com segurança no localStorage sem bloquear o registo em caso de falha.
 */
export function compressImageFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Falha ao ler o ficheiro de imagem.'));
    reader.onload = () => {
      const dataUrl = typeof reader.result === 'string' ? reader.result : '';
      if (!dataUrl) {
        reject(new Error('Conteúdo de imagem vazio.'));
        return;
      }

      const img = new Image();
      img.onerror = () => reject(new Error('Ficheiro de imagem inválido.'));
      img.onload = () => {
        try {
          const maxDim = 360;
          let { width, height } = img;
          if (width > maxDim || height > maxDim) {
            if (width >= height) {
              height = Math.round((height * maxDim) / width);
              width = maxDim;
            } else {
              width = Math.round((width * maxDim) / height);
              height = maxDim;
            }
          }
          const canvas = document.createElement('canvas');
          canvas.width = Math.max(1, width);
          canvas.height = Math.max(1, height);
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            reject(new Error('Contexto gráfico indisponível.'));
            return;
          }
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          const compressed = canvas.toDataURL('image/jpeg', 0.65);
          resolve(compressed);
        } catch (err) {
          reject(err);
        }
      };
      img.src = dataUrl;
    };
    reader.readAsDataURL(file);
  });
}
