import React from 'react';
import L from 'leaflet';
import { MapContainer, Marker, TileLayer, useMapEvents } from 'react-leaflet';
import { isValidCoordinates } from '../lib/accessibility';

const CASCAIS_CENTER: [number, number] = [38.698, -9.376];
const DEFAULT_ZOOM = 12;

const pickerIcon = L.divIcon({
  className: 'custom-leaflet-pin-wrapper',
  html: '<div class="map-pin map-pin-picker" aria-hidden="true"><span>●</span></div>',
  iconSize: [32, 40],
  iconAnchor: [16, 38],
});

interface LocationPickerProps {
  latitude: number | null;
  longitude: number | null;
  onSelectLocation: (lat: number, lng: number) => void;
}

const MapClickHandler: React.FC<{
  onSelectLocation: (lat: number, lng: number) => void;
}> = ({ onSelectLocation }) => {
  useMapEvents({
    click(event) {
      onSelectLocation(event.latlng.lat, event.latlng.lng);
    },
  });
  return null;
};

export const LocationPicker: React.FC<LocationPickerProps> = ({
  latitude,
  longitude,
  onSelectLocation,
}) => {
  const hasValidSelection =
    latitude !== null &&
    longitude !== null &&
    isValidCoordinates(latitude, longitude);

  return (
    <div className="location-picker">
      <div className="map-wrapper map-wrapper-picker">
        <MapContainer
          center={CASCAIS_CENTER}
          zoom={DEFAULT_ZOOM}
          scrollWheelZoom={true}
          className="leaflet-container-box"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">OpenStreetMap</a> contributors'
            url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <MapClickHandler onSelectLocation={onSelectLocation} />
          {hasValidSelection && (
            <Marker position={[latitude, longitude]} icon={pickerIcon} />
          )}
        </MapContainer>
      </div>

      <div className="coordinates-readout" aria-live="polite">
        {hasValidSelection ? (
          <span>
            <strong>Localização selecionada:</strong> Latitude{' '}
            <code>{latitude.toFixed(5)}</code>, Longitude{' '}
            <code>{longitude.toFixed(5)}</code>
          </span>
        ) : (
          <span className="muted-text">
            Nenhuma coordenada selecionada. Clique diretamente no mapa para marcar a entrada do estabelecimento.
          </span>
        )}
      </div>
    </div>
  );
};
