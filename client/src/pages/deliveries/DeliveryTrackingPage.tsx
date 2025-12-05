import DeliveryMapComponent from '@/components/map/DeliveryMapComponent';
import { useToast } from '@/hooks/use-toast';
import type { Delivery } from '@/types/delivery';
import { useEffect, useState } from 'react';

export default function DeliveryTrackingPage() {
  const { toast } = useToast();
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [selectedDeliveryId, setSelectedDeliveryId] = useState<string | null>(
    null
  );
  const [eta, setEta] = useState<number | null>(null); // ETA en minutes

  // Simuler la récupération des données de livraisons
  useEffect(() => {
    try {
      // TODO: remplacer par appel API réel
      const demoDeliveries: Delivery[] = [
        {
          id: '1',
          trackingNumber: 'DEL-2023-001',
          status: 'En cours',
          deliveryAddress: '123 Rue de Paris, 75001 Paris',
          estimatedDelivery: '2023-06-15T14:30:00.000Z',
          location: {
            type: 'Point',
            coordinates: [2.3522, 48.8566],
          },
          customerName: 'Jean Dupont',
          customerPhone: '+33123456789',
          notes: 'Sonner deux fois',
          createdAt: '2023-06-10T09:00:00.000Z',
          updatedAt: '2023-06-10T09:00:00.000Z',
        },
        {
          id: '2',
          trackingNumber: 'DEL-2023-002',
          status: 'En attente',
          deliveryAddress: '456 Avenue des Champs-Élysées, 75008 Paris',
          estimatedDelivery: '2023-06-16T10:00:00.000Z',
          location: {
            type: 'Point',
            coordinates: [2.3019, 48.8705],
          },
          customerName: 'Marie Martin',
          customerPhone: '+33612345678',
          notes: 'Déposer au gardien',
          createdAt: '2023-06-11T11:30:00.000Z',
          updatedAt: '2023-06-11T11:30:00.000Z',
        },
      ];
      setDeliveries(demoDeliveries);
    } catch (error) {
      console.error('Erreur lors du chargement des livraisons :', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de charger les livraisons',
        variant: 'destructive',
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Gestion du clic sur un marqueur
  const handleMarkerClick = (deliveryId: string) => {
    setSelectedDeliveryId(deliveryId);
    
    // Trouver la livraison sélectionnée
    const selectedDelivery = deliveries.find(d => d.id === deliveryId);
    
    if (selectedDelivery) {
      toast({
        title: 'Livraison sélectionnée',
        description: `Client: ${selectedDelivery.customerName}`,
      });
      
      // Simulation de calcul d'ETA basé sur la position
      // TODO: Remplacer par un vrai calcul ou un appel API
      const randomEta = Math.floor(Math.random() * 30) + 5; // Entre 5 et 35 minutes
      setEta(randomEta);
    }
  };

  return (
    <div className="flex h-full flex-col">
      <div className="flex-1">
        <DeliveryMapComponent
          deliveries={deliveries}
          selectedDeliveryId={selectedDeliveryId || undefined}
          onMarkerClick={handleMarkerClick}
          className="h-full w-full"
          zoom={13}
        />
      </div>

      <div className="border-t p-4 bg-gray-50">
        {selectedDeliveryId ? (
          <div className="space-y-2">
            <h3 className="font-medium">Détails de la livraison</h3>
            <p>✅ ETA estimée : <span className="font-semibold">{eta} minutes</span></p>
            {deliveries.find(d => d.id === selectedDeliveryId)?.notes && (
              <p>📝 Note : {deliveries.find(d => d.id === selectedDeliveryId)?.notes}</p>
            )}
          </div>
        ) : (
          <p className="text-muted-foreground">Sélectionnez une livraison sur la carte pour voir les détails</p>
        )}
      </div>
    </div>
  );
}
