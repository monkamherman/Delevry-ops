import DeliveryMapComponent from '@/components/map/DeliveryMapComponent';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import type { Delivery } from '@/types/delivery';
import { useEffect, useState } from 'react';

// Types
type DeliveryStatus = 'En attente' | 'En cours' | 'Livré' | 'Annulé';

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
      coordinates: [2.3522, 48.8566],
    },
    customerName: 'Jean Dupont',
    customerPhone: '+33123456789',
    notes: 'Sonner deux fois',
    createdAt: '2023-06-10T09:00:00.000Z',
    updatedAt: '2023-06-10T09:00:00.000Z',
  },
  // ... autres livraisons
];

export default function LivreurDashboard() {
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [selectedDelivery, setSelectedDelivery] = useState<Delivery | null>(
    null
  );
  const [activeTab, setActiveTab] = useState('a-livrer');

  // Charger les livraisons
  useEffect(() => {
    // TODO: Remplacer par un appel API
    setDeliveries(demoDeliveries);
  }, []);

  // Mettre à jour le statut d'une livraison
  const { toast } = useToast();

  const updateDeliveryStatus = async (
    deliveryId: string,
    newStatus: DeliveryStatus
  ) => {
    try {
      // TODO: Appel API pour mettre à jour le statut
      setDeliveries((prev) =>
        prev.map((d) => (d.id === deliveryId ? { ...d, status: newStatus } : d))
      );
      toast({
        title: 'Succès',
        description: `Statut mis à jour: ${newStatus}`,
      });
    } catch {
      toast({
        title: 'Erreur',
        description: 'Erreur lors de la mise à jour du statut',
        variant: 'destructive',
      });
    }
  };

  // Filtrer les livraisons par statut
  const filteredDeliveries = deliveries.filter((delivery) => {
    if (activeTab === 'a-livrer') return delivery.status === 'En attente';
    if (activeTab === 'en-cours') return delivery.status === 'En cours';
    if (activeTab === 'historique')
      return ['Livré', 'Annulé'].includes(delivery.status);
    return true;
  });

  return (
    <div className="grid grid-cols-1 gap-6 p-6 lg:grid-cols-3">
      {/* Colonne de gauche : Liste des livraisons */}
      <div className="space-y-4 lg:col-span-1">
        <h1 className="text-2xl font-bold">Tableau de bord Livreur</h1>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="a-livrer">À livrer</TabsTrigger>
            <TabsTrigger value="en-cours">En cours</TabsTrigger>
            <TabsTrigger value="historique">Historique</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-4 space-y-4">
            {filteredDeliveries.map((delivery) => (
              <Card
                key={delivery.id}
                className={`cursor-pointer hover:border-primary ${
                  selectedDelivery?.id === delivery.id ? 'border-primary' : ''
                }`}
                onClick={() => setSelectedDelivery(delivery)}
              >
                <CardHeader className="p-4 pb-2">
                  <CardTitle className="text-lg">
                    {delivery.customerName}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <p className="text-sm text-muted-foreground">
                    {delivery.deliveryAddress}
                  </p>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-sm font-medium">
                      {delivery.trackingNumber}
                    </span>
                    <span className="text-sm">
                      {delivery.estimatedDelivery
                        ? new Date(
                            delivery.estimatedDelivery
                          ).toLocaleTimeString()
                        : 'N/A'}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      </div>

      {/* Colonne de droite : Carte et détails */}
      <div className="space-y-4 lg:col-span-2">
        {/* Carte */}
        <Card className="h-[400px]">
          <DeliveryMapComponent
            deliveries={filteredDeliveries}
            selectedDeliveryId={selectedDelivery?.id}
            className="h-full w-full"
            zoom={13}
          />
        </Card>

        {/* Détails de la livraison sélectionnée */}
        {selectedDelivery && (
          <Card>
            <CardHeader>
              <CardTitle>Détails de la livraison</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium">Client</h3>
                  <p>{selectedDelivery.customerName}</p>
                  <p className="text-sm text-muted-foreground">
                    {selectedDelivery.customerPhone}
                  </p>
                </div>

                <div>
                  <h3 className="font-medium">Adresse de livraison</h3>
                  <p>{selectedDelivery.deliveryAddress}</p>
                </div>

                {selectedDelivery.notes && (
                  <div>
                    <h3 className="font-medium">Notes</h3>
                    <p className="text-sm">{selectedDelivery.notes}</p>
                  </div>
                )}

                <div className="flex gap-2 pt-2">
                  {selectedDelivery.status === 'En attente' && (
                    <Button
                      onClick={() =>
                        updateDeliveryStatus(selectedDelivery.id, 'En cours')
                      }
                    >
                      Commencer la livraison
                    </Button>
                  )}

                  {selectedDelivery.status === 'En cours' && (
                    <>
                      <Button
                        variant="outline"
                        onClick={() =>
                          updateDeliveryStatus(selectedDelivery.id, 'Livré')
                        }
                      >
                        Marquer comme livré
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() =>
                          updateDeliveryStatus(selectedDelivery.id, 'Annulé')
                        }
                      >
                        Annuler
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
