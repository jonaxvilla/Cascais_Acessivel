import React, { useEffect, useState } from 'react';
import { Establishment } from '../types';

interface ReportModalProps {
  establishment: Establishment | null;
  onClose: () => void;
  onSubmit: (establishmentId: string, description: string) => void;
}

export const ReportModal: React.FC<ReportModalProps> = ({
  establishment,
  onClose,
  onSubmit,
}) => {
  const [description, setDescription] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!establishment) return;
    setDescription('');
    setError(null);

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [establishment, onClose]);

  if (!establishment) return null;

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const trimmed = description.trim();
    if (!trimmed) {
      setError('Por favor, descreva a inconsistência observada.');
      return;
    }
    setError(null);
    onSubmit(establishment.id, trimmed);
    setDescription('');
  };

  return (
    <div
      className="modal-backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby="report-modal-title"
    >
      <div className="modal-card">
        <div className="modal-header">
          <h3 id="report-modal-title">Reportar inconsistência</h3>
          <button
            type="button"
            className="btn-close"
            onClick={onClose}
            aria-label="Fechar janela de reporte"
          >
            ✕
          </button>
        </div>

        <p className="modal-context">
          Estabelecimento: <strong>{establishment.name}</strong> ({establishment.locality})
        </p>

        <form onSubmit={handleSubmit} noValidate>
          <div className="form-field">
            <label htmlFor="report-description">
              Descrição da observação no local <span aria-hidden="true">*</span>
            </label>
            <textarea
              id="report-description"
              rows={4}
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
                if (error) setError(null);
              }}
              placeholder="Ex.: A entrada tem um pequeno degrau não declarado."
              autoFocus
              required
            />
            {error && (
              <p className="field-error" role="alert">
                {error}
              </p>
            )}
          </div>

          <p className="form-helper">
            Nota: O reporte será encaminhado para análise na vista da Autarquia neste navegador e não altera automaticamente a avaliação preliminar registada.
          </p>

          <div className="modal-actions">
            <button
              type="button"
              className="btn btn-outline"
              onClick={onClose}
            >
              Cancelar
            </button>
            <button type="submit" className="btn btn-primary">
              Submeter reporte
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
