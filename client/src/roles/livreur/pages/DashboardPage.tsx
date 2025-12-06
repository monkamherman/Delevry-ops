import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Package, 
  Clock, 
  CheckCircle, 
  AlertTriangle, 
  MapPin, 
  Clock4,
  ArrowRight
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Progress } from '../../../components/ui/progress';
import LiveTrackingMap from '../../../components/LiveTrackingMap';

// Données factices pour la démonstration
const stats = [
  { name: 'Livraisons du jour', value: '12', icon: Package, change: '+2%', changeType: 'increase' },
  { name: 'En cours', value: '3', icon: Clock, change: '+1', changeType: 'increase' },
  { name: 'Terminées', value: '8', icon: CheckCircle, change: '+3', changeType: 'increase' },
  { name: 'Retards', value: '1', icon: AlertTriangle, change: '0', changeType: 'neutral' },
];

const upcomingDeliveries = [
  { 
    id: 'D-1001', 
    address: '123 Rue de Paris, 75001', 
    time: '10:30 - 11:00',
    status: 'En route',
    progress: 40
  },
  { 
    id: 'D-1002', 
    address: '45 Avenue des Champs-Élysées, 75008', 
    time: '11:15 - 11:45',
    status: 'À venir',
    progress: 0
  },
  { 
    id: 'D-1003', 
    address: '22 Rue du Faubourg Saint-Honoré, 75008', 
    time: '12:00 - 12:30',
    status: 'À venir',
    progress: 0
  },
];

const DashboardPage: React.FC = () => {
  // Position de démonstration (Tour Eiffel)
  const currentPosition = { lat: 48.8584, lng: 2.2945 };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Tableau de bord</h1>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Clock4 className="mr-2 h-4 w-4" />
            Pause déjeuner
          </Button>
          <Button variant="outline" size="sm">
            <AlertTriangle className="mr-2 h-4 w-4" />
            Signaler un problème
          </Button>
        </div>
      </div>

      {/* Cartes de statistiques */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.name}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.name}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                {stat.changeType === 'increase' ? (
                  <span className="text-green-500">+{stat.change} par rapport à hier</span>
                ) : stat.changeType === 'decrease' ? (
                  <span className="text-red-500">-{stat.change} par rapport à hier</span>
                ) : (
                  <span className="text-gray-500">Identique à hier</span>
                )}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        {/* Carte de la carte */}
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Ma position actuelle</CardTitle>
          </CardHeader>
          <CardContent className="h-[400px] p-0 overflow-hidden">
            <LiveTrackingMap
              center={[currentPosition.lat, currentPosition.lng]}
              zoom={14}
              style={{ height: '100%', width: '100%' }}
              showControls={true}
              livreurs={[
                {
                  id: 'me',
                  name: 'Moi',
                  position: currentPosition,
                  status: 'En livraison',
                  lastUpdate: new Date()
                }
              ]}
            />
          </CardContent>
        </Card>

        {/* Prochaines livraisons */}
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Prochaines livraisons</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {upcomingDeliveries.map((delivery) => (
                <div key={delivery.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-medium">Livraison {delivery.id}</div>
                      <div className="text-sm text-muted-foreground flex items-center mt-1">
                        <MapPin className="h-3.5 w-3.5 mr-1.5" />
                        {delivery.address}
                      </div>
                      <div className="text-sm text-muted-foreground flex items-center mt-1">
                        <Clock className="h-3.5 w-3.5 mr-1.5" />
                        {delivery.time}
                      </div>
                    </div>
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      delivery.status === 'En route' 
                        ? 'bg-blue-100 text-blue-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {delivery.status}
                    </span>
                  </div>
                  
                  {delivery.progress > 0 && (
                    <div className="mt-3">
                      <div className="flex justify-between text-sm text-muted-foreground mb-1">
                        <span>Progression</span>
                        <span>{delivery.progress}%</span>
                      </div>
                      <Progress value={delivery.progress} className="h-2" />
                    </div>
                  )}
                  
                  <Button variant="outline" size="sm" className="mt-3 w-full">
                    Détails <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              ))}
              
              <div className="text-center">
                <Button variant="ghost" asChild>
                  <Link to="/livreur/livraisons">
                    Voir toutes les livraisons
                  </Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Dernières activités */}
      <Card>
        <CardHeader>
          <CardTitle>Activités récentes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { id: 1, type: 'delivery', action: 'Livraison #D-1000 terminée avec succès', time: 'Il y a 5 minutes', icon: CheckCircle },
              { id: 2, type: 'delay', action: 'Retard signalé sur la livraison #D-999', time: 'Il y a 1 heure', icon: AlertTriangle },
              { id: 3, type: 'start', action: 'Tournée du jour commencée', time: 'Aujourd\'hui, 08:30', icon: Package },
            ].map((activity) => (
              <div key={activity.id} className="flex items-start pb-4 last:pb-0">
                <div className={`rounded-full p-2 ${
                  activity.type === 'delay' 
                    ? 'bg-red-100 text-red-600' 
                    : activity.type === 'delivery'
                    ? 'bg-green-100 text-green-600'
                    : 'bg-blue-100 text-blue-600'
                }`}>
                  <activity.icon className="h-4 w-4" />
                </div>
                <div className="ml-4 space-y-1">
                  <p className="text-sm font-medium leading-none">{activity.action}</p>
                  <p className="text-sm text-muted-foreground">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardPage;
