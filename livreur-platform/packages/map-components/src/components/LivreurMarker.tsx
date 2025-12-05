import React from 'react';
import { Marker, Popup } from 'react-leaflet';
import { LatLngExpression } from 'leaflet';
import { Livreur } from '../types';

interface LivreurMarkerProps {
  livreur: Livreur;
  onClick?: (livreur: Livreur) => void;
  zIndexOffset?: number;
}

const statusColors = {
  available: '#4CAF50', // Vert
  'on-delivery': '#FFC107', // Jaune
  offline: '#9E9E9E', // Gris
} as const;

const vehicleIcons = {
  bike: '🚲',
  scooter: '🛵',
  car: '🚗',
  truck: '🚚',
  default: '👤',
} as const;

export const LivreurMarker: React.FC<LivreurMarkerProps> = ({
  livreur,
  onClick,
  zIndexOffset = 0,
}) => {
  const { position, name, status, vehicleType = 'default' } = livreur;
  const icon = vehicleIcons[vehicleType] || vehicleIcons.default;
  const color = statusColors[status];

  const handleClick = () => {
    if (onClick) {
      onClick(livreur);
    }
  };

  return (
    <Marker
      position={[position.lat, position.lng]}
      eventHandlers={{
        click: handleClick,
      }}
      zIndexOffset={zIndexOffset}
      icon={L.divIcon({
        html: `
          <div style="
            background: ${color};
            width: 32px;
            height: 32px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
            border: 2px solid white;
            font-size: 16px;
            transform: translate(-50%, -50%);
            box-shadow: 0 2px 4px rgba(0,0,0,0.2);
          ">
            <span style="font-size: 20px;">${icon}</span>
          </div>
        `,
        className: 'livreur-marker',
        iconSize: [32, 32],
        iconAnchor: [16, 16],
      })}
    >
      <Popup>
        <div>
          <h4>{name}</h4>
          <p>Statut: {status === 'on-delivery' ? 'En livraison' : status === 'available' ? 'Disponible' : 'Hors ligne'}</p>
          {livreur.vehicleType && <p>Véhicule: {livreur.vehicleType}</p>}
          {livreur.currentDeliveryId && <p>Livraison en cours: {livreur.currentDeliveryId}</p>}
        </div>
      </Popup>
    </Marker>
  );
};

export default LivreurMarker;
