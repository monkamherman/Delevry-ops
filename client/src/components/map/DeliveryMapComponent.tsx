import React, { useRef, useEffect } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { Delivery } from '@/types/delivery';

// Les icônes Leaflet sont chargées via CSS, les URLs sont conservées pour référence
// const iconRetinaUrl = 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png';
// const iconUrl = 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png';
// const shadowUrl = 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png';

// Définition des props du composant
interface DeliveryMapProps {
  deliveries: Delivery[];
  selectedDeliveryId?: string;
  onMarkerClick?: (deliveryId: string) => void;
  className?: string;
  center?: [number, number];
  zoom?: number;
}

const DeliveryMapComponent: React.FC<DeliveryMapProps> = ({
  deliveries,
  selectedDeliveryId,
  onMarkerClick,
  className = 'h-[400px] w-full',
  center = [48.8566, 2.3522] as [number, number], // Paris par défaut
  zoom = 12,
}) => {
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const markersRef = useRef<L.Marker[]>([]);

  // Initialisation de la carte
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    // Création de la carte
    mapRef.current = L.map(mapContainerRef.current, {
      zoomControl: false,
    }).setView(center, zoom);

    // Ajout de la couche de tuiles OpenStreetMap
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
    }).addTo(mapRef.current);

    // Ajout du contrôle de zoom
    L.control.zoom({
      position: 'bottomright',
    }).addTo(mapRef.current);

    // Nettoyage lors du démontage du composant
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [center, zoom]);

  // Mise à jour des marqueurs lorsque les livraisons changent
  useEffect(() => {
    if (!mapRef.current) return;

    // Suppression des anciens marqueurs
    markersRef.current.forEach(marker => {
      mapRef.current?.removeLayer(marker);
    });
    markersRef.current = [];

    // Ajout des nouveaux marqueurs
    deliveries.forEach(delivery => {
      if (!delivery.location?.coordinates) return;

      const [lng, lat] = delivery.location.coordinates;
      const isSelected = delivery.id === selectedDeliveryId;

      // Création d'une icône personnalisée
      const icon = L.divIcon({
        html: `
          <div class="relative">
            <div class="flex items-center justify-center w-10 h-10 rounded-full bg-white border-2 ${
              isSelected ? 'border-blue-500' : 'border-gray-300'
            } shadow-md">
              <svg class="w-5 h-5 ${isSelected ? 'text-blue-500' : 'text-gray-600'}" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 0L9 7m6-3v13"></path>
              </svg>
            </div>
            ${
              isSelected
                ? '<div class="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-white rotate-45 border-r border-b border-gray-300"></div>'
                : ''
            }
          </div>
        `,
        className: 'bg-transparent border-none',
        iconSize: [40, 40],
        iconAnchor: [20, 40],
        popupAnchor: [0, -40],
      });

      // Création du marqueur
      const marker = L.marker([lat, lng], { icon })
        .addTo(mapRef.current!)
        .bindPopup(
          `
          <div class="p-2">
            <div class="flex items-center gap-2 mb-2">
              <svg class="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
              </svg>
              <h4 class="font-medium">Livraison #${delivery.trackingNumber}</h4>
            </div>
            <p class="text-sm text-gray-600">${delivery.deliveryAddress}</p>
            <div class="mt-2 pt-2 border-t border-gray-100">
              <span class="inline-block px-2 py-1 text-xs rounded-full ${
                delivery.status === 'En cours' ? 'bg-blue-100 text-blue-800' :
                delivery.status === 'Livré' ? 'bg-green-100 text-green-800' :
                delivery.status === 'En attente' ? 'bg-yellow-100 text-yellow-800' :
                'bg-gray-100 text-gray-800'
              }">
                ${delivery.status}
              </span>
            </div>
          </div>
        `
        );

      // Gestion du clic sur le marqueur
      marker.on('click', () => {
        onMarkerClick?.(delivery.id);
      });

      markersRef.current.push(marker);
    });

    // Ajustement de la vue pour afficher tous les marqueurs
    if (markersRef.current.length > 0) {
      const group = L.featureGroup(markersRef.current);
      mapRef.current.fitBounds(group.getBounds().pad(0.1));
    }
  }, [deliveries, selectedDeliveryId, onMarkerClick]);

  // Mise à jour du centre de la carte
  useEffect(() => {
    if (!mapRef.current) return;
    mapRef.current.setView(center, zoom);
  }, [center, zoom]);

  return (
    <div 
      ref={mapContainerRef} 
      className={className}
      style={{ 
        height: '100%', 
        width: '100%',
        borderRadius: '0.5rem',
        overflow: 'hidden',
      }}
    />
  );
};

export default DeliveryMapComponent;
