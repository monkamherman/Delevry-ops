import React from 'react';
import { Marker, Popup, Tooltip } from 'react-leaflet';
import * as L from 'leaflet';
import type { Delivery, Position } from '../types';

// Définition des types pour les statuts
type DeliveryStatus = 'pending' | 'in-progress' | 'delivered' | 'failed';

// Extension de l'interface Delivery pour inclure les champs utilisés
interface ExtendedDelivery extends Omit<Delivery, 'status'> {
  id: string;
  status: DeliveryStatus;
  position: Position;
  address: string;
  recipientName?: string;
}

interface DeliveryMarkersProps {
  deliveries: ExtendedDelivery[];
  onDeliveryClick?: (delivery: ExtendedDelivery) => void;
  showTooltip?: boolean;
  zIndexOffset?: number;
}

const statusIcons: Record<DeliveryStatus, string> = {
  pending: '🟡', // Jaune
  'in-progress': '🔵', // Bleu
  delivered: '🟢', // Vert
  failed: '🔴', // Rouge
} as const;

const statusLabels: Record<DeliveryStatus, string> = {
  pending: 'En attente',
  'in-progress': 'En cours',
  delivered: 'Livrée',
  failed: 'Échouée',
} as const;

export const DeliveryMarkers: React.FC<DeliveryMarkersProps> = ({
  deliveries,
  onDeliveryClick,
  showTooltip = true,
  zIndexOffset = 0,
}) => {
  const handleClick = (delivery: ExtendedDelivery) => {
    if (onDeliveryClick) {
      onDeliveryClick(delivery);
    }
  };

  return (
    <>
      {deliveries.map((delivery) => {
        const { position, id, status, address, recipientName } = delivery;
        const icon = statusIcons[status];
        const statusLabel = statusLabels[status];

        return (
          <Marker
            key={id}
            position={[position.lat, position.lng]}
            eventHandlers={{
              click: () => handleClick(delivery),
            }}
            zIndexOffset={zIndexOffset}
            icon={L.divIcon({
              html: `
                <div style="
                  background: white;
                  width: 28px;
                  height: 28px;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  border-radius: 50%;
                  border: 2px solid currentColor;
                  color: ${status === 'delivered' ? 'var(--success-color, #4CAF50)' : 
                         status === 'failed' ? 'var(--error-color, #F44336)' : 
                         status === 'in-progress' ? 'var(--info-color, #2196F3)' : 
                         'var(--warning-color, #FFC107)'};
                  font-size: 14px;
                  transform: translate(-50%, -50%);
                  box-shadow: 0 2px 4px rgba(0,0,0,0.2);
                ">
                  <span style="font-size: 16px;">${icon}</span>
                </div>
              `,
              className: 'delivery-marker',
              iconSize: [28, 28],
              iconAnchor: [14, 14],
            })}
          >
            {showTooltip && (
              <Tooltip direction="top" offset={[0, -10]} opacity={1}>
                <div>
                  <strong>Livraison #{id.substring(0, 6)}</strong>
                  <div>Statut: {statusLabel}</div>
                  {recipientName && <div>Destinataire: {recipientName}</div>}
                </div>
              </Tooltip>
            )}
            <Popup>
              <div>
                <h4>Livraison #{id.substring(0, 6)}</h4>
                <p>Statut: {statusLabel}</p>
                <p>Adresse: {address}</p>
                {recipientName && <p>Destinataire: {recipientName}</p>}
                {position.timestamp && (
                  <p>
                    Mise à jour: {new Date(position.timestamp).toLocaleString()}
                  </p>
                )}
              </div>
            </Popup>
          </Marker>
        );
      })}
    </>
  );
};

export default DeliveryMarkers;
