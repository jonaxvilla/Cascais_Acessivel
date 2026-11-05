import React, { useRef, useState } from 'react';
import { useAppData } from '../context/AppDataContext';
import { LocationPicker } from '../components/LocationPicker';
import { StatusBadge } from '../components/StatusBadge';
import { compressImageFile } from '../lib/storage';
import { isValidCoordinates } from '../lib/accessibility';
import { AppView, Establishment } from '../types';

interface MerchantPageProps {
  onNavigate: (view: AppView) => void;
}

interface FormErrors {
  name?: string;
  address?: string;
  locality?: string;
  entranceWidthCm?: string;
  hasSteps?: string;
  location?: string;
}

export const MerchantPage: React.FC<MerchantPageProps> = ({ onNavigate }) => {
  const { addEstablishment } = useAppData();

  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [locality, setLocality] = useState('');
  const [widthInput, setWidthInput] = useState('');
  const [hasSteps, setHasSteps] = useState<boolean | null>(null);
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);

  const [photoPreviewUrl, setPhotoPreviewUrl] = useState<string | null>(null);
  const [compressedPhotoDataUrl, setCompressedPhotoDataUrl] = useState<
    string | undefined
  >(undefined);
  const [photoNote, setPhotoNote] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [errors, setErrors] = useState<FormErrors>({});
  const [lastSubmitted, setLastSubmitted] = useState<{
    establishment: Establishment;
    savedWithoutPhoto: boolean;
  } | null>(null);

  const handlePhotoChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) {
      setPhotoPreviewUrl(null);
      setCompressedPhotoDataUrl(undefined);
      setPhotoNote(null);
      return;
    }

    try {
      const compressed = await compressImageFile(file);
      setPhotoPreviewUrl(compressed);
      setCompressedPhotoDataUrl(compressed);
      setPhotoNote(
        'Fotografia redimensionada e pronta para armazenamento local neste navegador.'
      );
    } catch {
      const fallbackPreview = URL.createObjectURL(file);
      setPhotoPreviewUrl(fallbackPreview);
      setCompressedPhotoDataUrl(undefined);
      setPhotoNote(
        'Pré-visualização disponível apenas nesta sessão: não foi possível comprimir a imagem para armazenamento local, mas o registo não será bloqueado.'
      );
    }
  };

  const handleClearPhoto = () => {
    if (photoPreviewUrl && photoPreviewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(photoPreviewUrl);
    }
    setPhotoPreviewUrl(null);
    setCompressedPhotoDataUrl(undefined);
    setPhotoNote(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSelectLocation = (lat: number, lng: number) => {
    setLatitude(lat);
    setLongitude(lng);
    if (errors.location) {
      setErrors((prev) => ({ ...prev, location: undefined }));
    }
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const nextErrors: FormErrors = {};
    if (!name.trim()) {
      nextErrors.name = 'Indique o nome do estabelecimento.';
    }
    if (!address.trim()) {
      nextErrors.address = 'Indique a morada do estabelecimento.';
    }
    if (!locality.trim()) {
      nextErrors.locality = 'Indique a localidade (ex.: Parede, Cascais).';
    }

    const parsedWidth = Number(widthInput.replace(',', '.'));
    if (
      !widthInput.trim() ||
      !Number.isFinite(parsedWidth) ||
      parsedWidth <= 0
    ) {
      nextErrors.entranceWidthCm =
        'Introduza uma largura de entrada válida (número positivo em cm).';
    }

    if (hasSteps === null) {
      nextErrors.hasSteps =
        'Selecione explicitamente se existem ou não degraus na entrada.';
    }

    if (
      latitude === null ||
      longitude === null ||
      !isValidCoordinates(latitude, longitude)
    ) {
      nextErrors.location =
        'Clique num ponto do mapa para definir as coordenadas do estabelecimento.';
    }

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    const result = addEstablishment({
      name,
      address,
      locality,
      latitude: latitude!,
      longitude: longitude!,
      entranceWidthCm: Math.round(parsedWidth * 10) / 10,
      hasSteps: hasSteps!,
      photoDataUrl: compressedPhotoDataUrl,
    });

    setLastSubmitted(result);

    // Limpar formulário para permitir novos registos
    setName('');
    setAddress('');
    setLocality('');
    setWidthInput('');
    setHasSteps(null);
    setLatitude(null);
    setLongitude(null);
    handleClearPhoto();
    setErrors({});
  };

  return (
    <section className="page-section" aria-labelledby="merchant-heading">
      <div className="section-intro">
        <div>
          <span className="eyebrow-kicker">02 · PORTAL DO COMERCIANTE</span>
          <h2 id="merchant-heading">Registar e dar visibilidade</h2>
          <p>
            Descreva as características medidas da entrada do seu estabelecimento no concelho de Cascais e obtenha uma avaliação preliminar imediata baseada em regras determinísticas.
          </p>
        </div>
      </div>

      {lastSubmitted && (
        <div className="confirmation-card" role="status" aria-live="polite">
          <div className="confirmation-header">
            <h3>Estabelecimento registado com sucesso</h3>
            <StatusBadge status={lastSubmitted.establishment.status} />
          </div>
          <p className="confirmation-summary">
            <strong>{lastSubmitted.establishment.name}</strong> (
            {lastSubmitted.establishment.locality}) — Largura:{' '}
            <strong>{lastSubmitted.establishment.entranceWidthCm} cm</strong> | Degraus:{' '}
            <strong>{lastSubmitted.establishment.hasSteps ? 'Sim' : 'Não'}</strong> | Coordenadas:{' '}
            <code>
              {lastSubmitted.establishment.latitude.toFixed(5)},{' '}
              {lastSubmitted.establishment.longitude.toFixed(5)}
            </code>
          </p>
          {lastSubmitted.savedWithoutPhoto && (
            <p className="warning-inline">
              Aviso: O registo foi guardado sem fotografia devido ao limite de espaço do armazenamento local do navegador.
            </p>
          )}
          <p className="assessment-disclaimer">
            <strong>Nota importante:</strong> O critério de largura igual ou superior a 80 cm sem degraus é um parâmetro meramente demonstrativo desta oficina. Este resultado preliminar não constitui selo oficial, certificação legal de acessibilidade nem elegibilidade para apoios públicos (como o Portugal 2030).
          </p>
          <div className="confirmation-actions">
            <button
              type="button"
              className="btn btn-outline"
              onClick={() => onNavigate('municipality')}
            >
              Consultar no painel da Autarquia
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => onNavigate('citizen')}
            >
              Ver marcador no mapa do Cidadão
            </button>
          </div>
        </div>
      )}

      <form className="card merchant-form" onSubmit={handleSubmit} noValidate>
        <div className="form-grid">
          <div className="form-column">
            <h3 className="subsection-title">1. Identificação e Entrada</h3>

            <div className="form-field">
              <label htmlFor="est-name">
                Nome do estabelecimento <span aria-hidden="true">*</span>
              </label>
              <input
                id="est-name"
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (errors.name) setErrors((p) => ({ ...p, name: undefined }));
                }}
                placeholder="Ex.: Café da Parede"
                required
              />
              {errors.name && (
                <p className="field-error" role="alert">
                  {errors.name}
                </p>
              )}
            </div>

            <div className="form-field">
              <label htmlFor="est-address">
                Morada <span aria-hidden="true">*</span>
              </label>
              <input
                id="est-address"
                type="text"
                value={address}
                onChange={(e) => {
                  setAddress(e.target.value);
                  if (errors.address)
                    setErrors((p) => ({ ...p, address: undefined }));
                }}
                placeholder="Ex.: Avenida da República, n.º 120"
                required
              />
              {errors.address && (
                <p className="field-error" role="alert">
                  {errors.address}
                </p>
              )}
            </div>

            <div className="form-field">
              <label htmlFor="est-locality">
                Localidade <span aria-hidden="true">*</span>
              </label>
              <input
                id="est-locality"
                type="text"
                list="cascais-localities"
                value={locality}
                onChange={(e) => {
                  setLocality(e.target.value);
                  if (errors.locality)
                    setErrors((p) => ({ ...p, locality: undefined }));
                }}
                placeholder="Ex.: Parede, Cascais"
                required
              />
              <datalist id="cascais-localities">
                <option value="Cascais" />
                <option value="Estoril" />
                <option value="Parede, Cascais" />
                <option value="Carcavelos, Cascais" />
                <option value="Alcabideche" />
                <option value="São Domingos de Rana" />
              </datalist>
              {errors.locality && (
                <p className="field-error" role="alert">
                  {errors.locality}
                </p>
              )}
            </div>

            <div className="form-field">
              <label htmlFor="est-width">
                Largura útil da entrada (cm) <span aria-hidden="true">*</span>
              </label>
              <input
                id="est-width"
                type="number"
                min="1"
                step="any"
                inputMode="decimal"
                value={widthInput}
                onChange={(e) => {
                  setWidthInput(e.target.value);
                  if (errors.entranceWidthCm)
                    setErrors((p) => ({ ...p, entranceWidthCm: undefined }));
                }}
                placeholder="Ex.: 85"
                required
              />
              <span className="field-hint">
                Meça a passagem livre da porta aberta em centímetros (parâmetro demonstrativo de referência: 80 cm).
              </span>
              {errors.entranceWidthCm && (
                <p className="field-error" role="alert">
                  {errors.entranceWidthCm}
                </p>
              )}
            </div>

            <fieldset className="form-field radio-fieldset">
              <legend>
                Existem degraus na entrada? <span aria-hidden="true">*</span>
              </legend>
              <div className="radio-group">
                <label className="radio-option">
                  <input
                    type="radio"
                    name="hasSteps"
                    checked={hasSteps === false}
                    onChange={() => {
                      setHasSteps(false);
                      if (errors.hasSteps)
                        setErrors((p) => ({ ...p, hasSteps: undefined }));
                    }}
                  />
                  <span>Não — entrada de nível ou com rampa acessível</span>
                </label>

                <label className="radio-option">
                  <input
                    type="radio"
                    name="hasSteps"
                    checked={hasSteps === true}
                    onChange={() => {
                      setHasSteps(true);
                      if (errors.hasSteps)
                        setErrors((p) => ({ ...p, hasSteps: undefined }));
                    }}
                  />
                  <span>Sim — existe pelo menos um degrau ou ressalto</span>
                </label>
              </div>
              {errors.hasSteps && (
                <p className="field-error" role="alert">
                  {errors.hasSteps}
                </p>
              )}
            </fieldset>

            <div className="form-field">
              <label htmlFor="est-photo">Fotografia da entrada (opcional)</label>
              <input
                ref={fileInputRef}
                id="est-photo"
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
              />
              {photoNote && <p className="field-hint">{photoNote}</p>}
              {photoPreviewUrl && (
                <div className="photo-preview-container">
                  <img
                    src={photoPreviewUrl}
                    alt="Pré-visualização da entrada do estabelecimento"
                    className="photo-preview-img"
                  />
                  <button
                    type="button"
                    className="btn btn-outline btn-sm"
                    onClick={handleClearPhoto}
                  >
                    Remover fotografia
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="form-column">
            <h3 className="subsection-title">
              2. Posição no Mapa <span aria-hidden="true">*</span>
            </h3>
            <p className="field-hint map-instruction">
              Clique sobre a localização do estabelecimento no mapa abaixo. As coordenadas não são calculadas automaticamente a partir da morada escrita.
            </p>

            <LocationPicker
              latitude={latitude}
              longitude={longitude}
              onSelectLocation={handleSelectLocation}
            />

            {errors.location && (
              <p className="field-error" role="alert">
                {errors.location}
              </p>
            )}

            <div className="rule-info-box">
              <h4>Regra determinística de avaliação preliminar</h4>
              <ul>
                <li>
                  <strong>Acessível — avaliação preliminar:</strong> largura ≥ 80 cm{' '}
                  <em>e</em> sem degraus na entrada.
                </li>
                <li>
                  <strong>Requer avaliação:</strong> largura inferior a 80 cm{' '}
                  <em>ou</em> existência de degraus.
                </li>
                <li>
                  <strong>Pendente:</strong> dados em falta ou inválidos.
                </li>
              </ul>
              <p className="small-disclaimer">
                Avaliação meramente ilustrativa para prova de conceito. Sem validade jurídica ou certificadora.
              </p>
            </div>
          </div>
        </div>

        <div className="form-footer">
          <p className="local-storage-note">
            Os dados submetidos ficam guardados apenas no armazenamento local (
            <code>localStorage</code>) deste navegador.
          </p>
          <button type="submit" className="btn btn-primary btn-lg">
            Avaliar e registar
          </button>
        </div>
      </form>
    </section>
  );
};
