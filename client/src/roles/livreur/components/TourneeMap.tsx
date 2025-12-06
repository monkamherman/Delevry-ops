import React from 'react';
import { Package, Clock, MapPin, ArrowRight, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Progress } from '../../../components/ui/progress';
import LiveTrackingMap from '../../../components/LiveTrackingMap';
import { Delivery, Livreur, Position, Route } from '../../../../packages/map-components/src/types';

interface TourneeMapProps {
  currentPosition: Position;
  deliveries: Array<{
    id: string;
    address: string;
    position: Position;
    status: 'pending' | 'in_progress' | 'delivered' | 'delayed';
    estimatedTime: string;
    timeWindow: string;
  }>;
  onDeliveryClick?: (deliveryId: string) => void;
  onStartTour?: () => void;
  onCompleteDelivery?: (deliveryId: string) => void;
  onReportIssue?: (deliveryId: string) => void;
}

const TourneeMap: React.FC<TourneeMapProps> = ({
  currentPosition,
  deliveries,
  onDeliveryClick,
  onStartTour,
  onCompleteDelivery,
  onReportIssue,
}) => {
  // Convertir les livraisons en format pour la carte
  const deliveryMarkers = deliveries.map(delivery => ({
    id: delivery.id,
    position: delivery.position,
    status: delivery.status,
    address: delivery.address,
  }));

  // Créer un itinéraire factice pour la démonstration
  const route: Route = {
    id: 'tour-123',
    waypoints: [
      currentPosition,
      ...deliveries.map(d => d.position)
    ],
    distance: 7.5, // km
    duration: 25, // minutes
    polyline: '', // Serait généré par le service d'itinéraires
  };

  // Livreur actuel
  const livreur: Livreur = {
    id: 'current-livreur',
    name: 'Moi',
    position: currentPosition,
    status: 'En livraison',
    lastUpdate: new Date(),
  };

  return (
    <div className="grid gap-4 grid-cols-1 lg:grid-cols-3">
      {/* Carte */}
      <div className="lg:col-span-2">
        <Card className="h-full">
          <CardHeader>
            <CardTitle>Itinéraire de tournée</CardTitle>
          </CardHeader>
          <CardContent className="h-[500px] p-0 overflow-hidden">
            <LiveTrackingMap
              center={[currentPosition.lat, currentPosition.lng]}
              zoom={14}
              style={{ height: '100%', width: '100%' }}
              showControls={true}
              livreurs={[livreur]}
              deliveries={deliveryMarkers}
              routes={[route]}
            />
          </CardContent>
        </Card>
      </div>

      {/* Liste des livraisons */}
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              <span>Livraisons ({deliveries.length})</span>
              <Button size="sm" onClick={onStartTour}>
                Démarrer la tournée
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {deliveries.map((delivery, index) => (
                <div 
                  key={delivery.id}
                  className={`border rounded-lg p-4 ${
                    delivery.status === 'in_progress' ? 'border-primary border-2' : ''
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="font-medium flex items-center">
                        <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-primary text-white text-xs font-medium mr-2">
                          {index + 1}
                        </span>
                        Livraison {delivery.id}
                      </div>
                      <div className="text-sm text-muted-foreground mt-1 flex items-center">
                        <MapPin className="h-3.5 w-3.5 mr-1.5 flex-shrink-0" />
                        <span className="truncate">{delivery.address}</span>
                      </div>
                      <div className="text-sm text-muted-foreground mt-1 flex items-center">
                        <Clock className="h-3.5 w-3.5 mr-1.5 flex-shrink-0" />
                        {delivery.timeWindow}
                      </div>
                    </div>
                    
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      delivery.status === 'delivered' 
                        ? 'bg-green-100 text-green-800' 
                        : delivery.status === 'in_progress'
                        ? 'bg-blue-100 text-blue-800'
                        : delivery.status === 'delayed'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {delivery.status === 'delivered' 
                        ? 'Livré' 
                        : delivery.status === 'in_progress' 
                        ? 'En cours' 
                        : delivery.status === 'delayed' 
                        ? 'En retard' 
                        : 'En attente'}
                    </span>
                  </div>

                  {delivery.status === 'in_progress' && (
                    <div className="mt-3 space-y-2">
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <span>Progression</span>
                        <span>40%</span>
                      </div>
                      <Progress value={40} className="h-2" />
                      
                      <div className="grid grid-cols-2 gap-2 mt-3">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => onCompleteDelivery?.(delivery.id)}
                        >
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Terminer
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          variant="destructive"
                          onClick={() => onReportIssue?.(delivery.id)}
                        >
                          <Package className="h-4 w-4 mr-2" />
                          Problème
                        </Button>
                      </div>
                    </div>
                  )}

                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="mt-2 w-full"
                    onClick={() => onDeliveryClick?.(delivery.id)}
                  >
                    Voir les détails <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Statistiques de la tournée */}
        <Card>
          <CardHeader>
            <CardTitle>Résumé de la tournée</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Distance totale</span>
              <span className="font-medium">{route.distance} km</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Temps estimé</span>
              <span className="font-medium">{route.duration} min</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Livraisons</span>
              <span className="font-medium">{deliveries.length} arrêts</span>
            </div>
            <div className="pt-2 border-t">
              <div className="flex justify-between text-sm font-medium">
                <span>Progression</span>
                <span>2/{deliveries.length} terminées</span>
              </div>
              <Progress value={(2 / deliveries.length) * 100} className="h-2 mt-2" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TourneeMap;
