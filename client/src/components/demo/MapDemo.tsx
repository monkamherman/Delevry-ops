import React, { useState } from 'react';
import DeliveryMap from '@/components/map/DeliveryMap';
import type { Delivery } from '@/types/delivery';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';

// Données de démonstration
const demoDeliveries: Delivery[] = [
  {
    id: '1',
    trackingNumber: 'DEL-2023-001',
    status: 'En cours',
    deliveryAddress: '123 Rue de Paris, 75001 Paris',
    estimatedDelivery: '2023-06-15T14:30:00.000Z',
    location: {
      type: 'Point',
      coordinates: [2.3522, 48.8566], // Paris
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
      coordinates: [2.3019, 48.8705], // Près de l'Arc de Triomphe
    },
    customerName: 'Marie Martin',
    customerPhone: '+33612345678',
    notes: 'Déposer au gardien',
    createdAt: '2023-06-11T11:30:00.000Z',
    updatedAt: '2023-06-11T11:30:00.000Z',
  },
  {
    id: '3',
    trackingNumber: 'DEL-2023-003',
    status: 'Livré',
    deliveryAddress: '789 Boulevard Saint-Germain, 75006 Paris',
    estimatedDelivery: '2023-06-10T16:45:00.000Z',
    deliveryDate: '2023-06-10T16:30:00.000Z',
    location: {
      type: 'Point',
      coordinates: [2.3333, 48.8534], // Saint-Germain-des-Prés
    },
    customerName: 'Sophie Durand',
    customerPhone: '+33712345678',
    notes: '',
    createdAt: '2023-06-09T14:15:00.000Z',
    updatedAt: '2023-06-10T16:30:00.000Z',
  },
];

export function MapDemo() {
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [selectedDelivery, setSelectedDelivery] = useState<Delivery | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [center] = useState<[number, number]>([48.8566, 2.3522]); // Paris

  // Simuler le chargement des données
  const loadDeliveries = () => {
    setIsLoading(true);
    // Simuler un chargement asynchrone
    setTimeout(() => {
      setDeliveries(demoDeliveries);
      setIsLoading(false);
    }, 500);
  };

  // Charger les données au montage du composant
  React.useEffect(() => {
    loadDeliveries();
  }, []);

  const handleMarkerClick = (deliveryId: string) => {
    const delivery = deliveries.find(d => d.id === deliveryId) || null;
    setSelectedDelivery(delivery);
  };

  const handleRefresh = () => {
    loadDeliveries();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Suivi des livraisons</h2>
          <p className="text-muted-foreground">
            Visualisez l'emplacement de vos livraisons en temps réel
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isLoading}>
          <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          {isLoading ? 'Chargement...' : 'Actualiser'}
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2">
          <div className="h-[600px] w-full rounded-lg overflow-hidden border">
            <DeliveryMap
              deliveries={deliveries}
              selectedDeliveryId={selectedDelivery?.id}
              onMarkerClick={handleMarkerClick}
              center={center}
              zoom={12}
            />
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-lg border p-4">
            <h3 className="text-lg font-medium mb-4">Détails de la livraison</h3>
            
            {selectedDelivery ? (
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">N° de suivi</p>
                  <p className="font-medium">{selectedDelivery.trackingNumber}</p>
                </div>
                
                <div>
                  <p className="text-sm text-muted-foreground">Statut</p>
                  <div className="flex items-center gap-2">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      selectedDelivery.status === 'En cours' ? 'bg-blue-100 text-blue-800' :
                      selectedDelivery.status === 'Livré' ? 'bg-green-100 text-green-800' :
                      selectedDelivery.status === 'En attente' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {selectedDelivery.status}
                    </span>
                  </div>
                </div>
                
                <div>
                  <p className="text-sm text-muted-foreground">Adresse de livraison</p>
                  <p className="font-medium">{selectedDelivery.deliveryAddress}</p>
                </div>
                
                <div>
                  <p className="text-sm text-muted-foreground">Client</p>
                  <p className="font-medium">{selectedDelivery.customerName}</p>
                  <p className="text-sm text-muted-foreground">{selectedDelivery.customerPhone}</p>
                </div>
                
                {selectedDelivery.notes && (
                  <div>
                    <p className="text-sm text-muted-foreground">Notes</p>
                    <p className="text-sm">{selectedDelivery.notes}</p>
                  </div>
                )}
                
                <div className="pt-2 border-t">
                  <Button variant="outline" size="sm" className="w-full">
                    Voir les détails complets
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <p>Sélectionnez une livraison sur la carte pour voir les détails</p>
              </div>
            )}
          </div>
          
          <div className="rounded-lg border p-4">
            <h3 className="text-lg font-medium mb-4">Légende</h3>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-blue-500 border-2 border-white shadow"></div>
                <span className="text-sm">En cours</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-yellow-500 border-2 border-white shadow"></div>
                <span className="text-sm">En attente</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-green-500 border-2 border-white shadow"></div>
                <span className="text-sm">Livré</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-red-500 border-2 border-white shadow"></div>
                <span className="text-sm">Annulé</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
