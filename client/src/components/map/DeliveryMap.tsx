import React, { useEffect, useState } from 'react';
import { Delivery } from '@/types/delivery';

// Définition des props du composant
export interface DeliveryMapProps {
  deliveries: Delivery[];
  selectedDeliveryId?: string;
  onMarkerClick?: (deliveryId: string) => void;
  className?: string;
  center?: [number, number];
  zoom?: number;
}

// Composant qui ne sera rendu que côté client
const DeliveryMap: React.FC<DeliveryMapProps> = (props) => {
  const [isClient, setIsClient] = useState(false);
  const [MapComponent, setMapComponent] = useState<React.ComponentType<DeliveryMapProps> | null>(null);

  useEffect(() => {
    // Chargement dynamique du composant de carte uniquement côté client
    if (typeof window !== 'undefined') {
      const loadMapComponent = async () => {
        const module = await import('./DeliveryMapComponent');
        setMapComponent(() => module.default);
        setIsClient(true);
      };
      loadMapComponent();
    }
  }, []);

  // Afficher un état de chargement pendant le chargement du composant
  if (!isClient || !MapComponent) {
    return (
      <div className={`flex items-center justify-center bg-gray-50 rounded-lg ${props.className || 'h-[400px] w-full'}`}>
        <div className="text-center p-6">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement de la carte...</p>
        </div>
      </div>
    );
  }

  // Rendu du composant de carte une fois chargé
  return <MapComponent {...props} />;
};

export default DeliveryMap;

// Fonction utilitaire pour combiner les classes
export function cn(...classes: (string | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}
