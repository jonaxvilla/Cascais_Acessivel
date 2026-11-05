import React from 'react';
import L from 'leaflet';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import { AccessibilityStatus, Establishment } from '../types';
import { getStatusSymbol, isValidCoordinates } from '../lib/accessibility';
import { StatusBadge } from './StatusBadge';

const CASCAIS_CENTER: [number, number] = [38.698, -9.376];
const DEFAULT_ZOOM = 12;

function createStatusIcon(status: AccessibilityStatus): L.DivIcon {
  const symbol = getStatusSymbol(status);
  return L.divIcon({
    className: 'custom-leaflet-pin-wrapper',
    html: `<div class="map-pin map-pin-${status}" aria-hidden="true"><span>${symbol}</span></div>`,
    iconSize: [34, 42],
    iconAnchor: [17, 40],
    popupAnchor: [0, -36],
  });
}

const STATUS_ICONS: Record<AccessibilityStatus, L.DivIcon> = {
  accessible: createStatusIcon('accessible'),
  needs_review: createStatusIcon('needs_review'),
  pending: createStatusIcon('pending'),
};

interface EstablishmentMapProps {
  establishments: Establishment[];
  onReportEstablishment: (establishment: Establishment) => void;
}

export const EstablishmentMap: React.FC<EstablishmentMapProps> = ({
  establishments,
  onReportEstablishment,
}) => {
  const validEstablishments = establishments.filter((est) =>
    isValidCoordinates(est.latitude, est.longitude)
  );

  return (
    <div className="map-wrapper map-wrapper-citizen">
      <MapContainer
        center={CASCAIS_CENTER}
        zoom={DEFAULT_ZOOM}
        scrollWheelZoom={true}
        className="leaflet-container-box leaflet-citizen-box"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">OpenStreetMap</a> contributors'
          url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {validEstablishments.map((est) => (
          <Marker
            key={est.id}
            position={[est.latitude, est.longitude]}
            icon={STATUS_ICONS[est.status]}
          >
            <Popup>
              <div className="map-popup-card">
                <div className="popup-header">
                  <strong className="popup-title">{est.name}</strong>
                  {est.isDemoData && (
                    <span className="demo-tag">Dados fictícios</span>
                  )}
                </div>

                <p className="popup-address">
                  {est.address} — <strong>{est.locality}</strong>
                </p>

                <div className="popup-status-row">
                  <StatusBadge status={est.status} />
                </div>

                <dl className="popup-details">
                  <div>
                    <dt>Largura da entrada:</dt>
                    <dd>
                      {est.entranceWidthCm !== null
                        ? `${est.entranceWidthCm} cm`
                        : 'Não indicada'}
                    </dd>
                  </div>
                  <div>
                    <dt>Degraus na entrada:</dt>
                    <dd>
                      {est.hasSteps === null
                        ? 'Não indicado'
                        : est.hasSteps
                          ? 'Sim'
                          : 'Não'}
                    </dd>
                  </div>
                </dl>

                {est.photoDataUrl && (
                  <div className="popup-photo-box">
                    <img
                      src={est.photoDataUrl}
                      alt={`Entrada de ${est.name}`}
                      className="popup-photo"
                    />
                  </div>
                )}

                <p className="popup-disclaimer">
                  Indicador preliminar demonstrativo (limiar de oficina: 80 cm sem degraus). Não constitui certificação legal.
                </p>

                <button
                  type="button"
                  className="btn btn-secondary btn-full popup-report-btn"
                  onClick={() => onReportEstablishment(est)}
                >
                  Reportar inconsistência
                </button>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};
