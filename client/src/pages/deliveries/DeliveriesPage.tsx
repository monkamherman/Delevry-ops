import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Filter, ListChecks, Package, Plus, Search } from 'lucide-react';
import React from 'react';
import { Link } from 'react-router-dom';

const DeliveriesPage: React.FC = () => {
  // Données de démonstration
  const activeDeliveries = [
    {
      id: 1,
      trackingNumber: 'DL-123456',
      status: 'En cours',
      deliveryAddress: '123 Rue de Paris, 75001',
      estimatedDelivery: "Aujourd'hui, 14h-16h",
    },
    {
      id: 2,
      trackingNumber: 'DL-789012',
      status: 'En attente',
      deliveryAddress: '45 Avenue des Champs-Élysées, 75008',
      estimatedDelivery: 'Demain, 10h-12h',
    },
  ];

  const pastDeliveries = [
    {
      id: 3,
      trackingNumber: 'DL-345678',
      status: 'Livré',
      deliveryAddress: '8 Rue de Rivoli, 75004',
      deliveryDate: '05/12/2024',
    },
    {
      id: 4,
      trackingNumber: 'DL-901234',
      status: 'Annulé',
      deliveryAddress: '22 Rue du Faubourg Saint-Honoré, 75008',
      deliveryDate: '03/12/2024',
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Mes Livraisons</h1>
          <p className="text-muted-foreground">
            Gérez et suivez vos livraisons en temps réel
          </p>
        </div>
        <Button asChild>
          <Link to="/new-delivery" className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Nouvelle livraison
          </Link>
        </Button>
      </div>

      <div className="flex flex-col gap-6 md:flex-row">
        <div className="w-full space-y-4 md:w-1/4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Rechercher une livraison..." className="pl-9" />
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Filtres</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">Statut</p>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 px-2">
                        <Filter className="mr-1 h-4 w-4" />
                        Filtrer
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                      <DropdownMenuLabel>Filtrer par statut</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      {[
                        'Tous',
                        'En cours',
                        'En attente',
                        'Livré',
                        'Annulé',
                      ].map((status) => (
                        <DropdownMenuCheckboxItem key={status}>
                          {status}
                        </DropdownMenuCheckboxItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <div className="space-y-2">
                  {['En cours', 'En attente', 'Livré', 'Annulé'].map(
                    (status) => (
                      <div key={status} className="flex items-center space-x-2">
                        <div className="flex items-center space-x-2">
                          <div
                            className={`h-2 w-2 rounded-full ${
                              status === 'En cours'
                                ? 'bg-blue-500'
                                : status === 'En attente'
                                  ? 'bg-yellow-500'
                                  : status === 'Livré'
                                    ? 'bg-green-500'
                                    : 'bg-red-500'
                            }`}
                          />
                          <span className="text-sm">{status}</span>
                        </div>
                      </div>
                    )
                  )}
                </div>
              </div>

              <div className="space-y-2 border-t pt-4">
                <p className="text-sm font-medium">Date</p>
                <div className="space-y-2">
                  {[
                    { id: 'all-dates', label: 'Toutes les dates' },
                    { id: 'today', label: "Aujourd'hui" },
                    { id: 'week', label: 'Cette semaine' },
                    { id: 'month', label: 'Ce mois-ci' },
                  ].map((item) => (
                    <div key={item.id} className="flex items-center space-x-2">
                      <input
                        type="radio"
                        id={item.id}
                        name="date"
                        className="h-4 w-4 border-gray-300 text-primary focus:ring-primary"
                        defaultChecked={item.id === 'all-dates'}
                      />
                      <label htmlFor={item.id} className="text-sm">
                        {item.label}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex-1">
          <Tabs defaultValue="active" className="w-full">
            <div className="mb-6 flex items-center justify-between">
              <TabsList className="grid w-[300px] grid-cols-2">
                <TabsTrigger value="active" className="flex items-center gap-2">
                  <ListChecks className="h-4 w-4" />
                  En cours ({activeDeliveries.length})
                </TabsTrigger>
                <TabsTrigger value="past" className="flex items-center gap-2">
                  <Package className="h-4 w-4" />
                  Historique ({pastDeliveries.length})
                </TabsTrigger>
              </TabsList>
              <Button asChild>
                <Link to="/deliveries/new" className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Nouvelle livraison
                </Link>
              </Button>
            </div>

            <TabsContent value="active" className="space-y-4">
              {activeDeliveries.length > 0 ? (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-1">
                  {activeDeliveries.map((delivery) => (
                    <Card
                      key={delivery.id}
                      className="border-l-4 border-blue-500 transition-shadow hover:shadow-md"
                    >
                      <CardHeader className="p-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle className="text-lg">
                              <Link
                                to={`/deliveries/${delivery.id}`}
                                className="hover:underline"
                              >
                                {delivery.trackingNumber}
                              </Link>
                            </CardTitle>
                            <p className="mt-1 text-sm text-muted-foreground">
                              {delivery.deliveryAddress}
                            </p>
                          </div>
                          <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
                            {delivery.status}
                          </span>
                        </div>
                      </CardHeader>
                      <CardContent className="p-4 pt-0">
                        <div className="flex items-center text-sm text-muted-foreground">
                          <span className="font-medium text-foreground">
                            Livraison estimée :
                          </span>
                          <span className="ml-2">
                            {delivery.estimatedDelivery}
                          </span>
                        </div>
                        <div className="mt-3 flex justify-end">
                          <Button variant="outline" size="sm" asChild>
                            <Link to={`/deliveries/${delivery.id}/track`}>
                              Suivre
                            </Link>
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="py-12 text-center">
                    <Package className="mx-auto h-12 w-12 text-muted-foreground" />
                    <h3 className="mt-4 text-lg font-medium">
                      Aucune livraison en cours
                    </h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Toutes vos livraisons en cours s'afficheront ici.
                    </p>
                    <Button className="mt-4" asChild>
                      <Link to="/deliveries/new">
                        Créer une nouvelle livraison
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="past" className="space-y-4">
              {pastDeliveries.length > 0 ? (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-1">
                  {pastDeliveries.map((delivery) => {
                    const statusColor =
                      delivery.status === 'Livré'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800';

                    return (
                      <Card
                        key={delivery.id}
                        className="transition-shadow hover:shadow-md"
                      >
                        <CardHeader className="p-4">
                          <div className="flex items-start justify-between">
                            <div>
                              <CardTitle className="text-lg">
                                <Link
                                  to={`/deliveries/${delivery.id}`}
                                  className="hover:underline"
                                >
                                  {delivery.trackingNumber}
                                </Link>
                              </CardTitle>
                              <p className="mt-1 text-sm text-muted-foreground">
                                {delivery.deliveryAddress}
                              </p>
                            </div>
                            <span
                              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColor}`}
                            >
                              {delivery.status}
                            </span>
                          </div>
                        </CardHeader>
                        <CardContent className="p-4 pt-0">
                          <div className="flex items-center text-sm text-muted-foreground">
                            <span className="font-medium text-foreground">
                              Date de livraison :
                            </span>
                            <span className="ml-2">
                              {delivery.deliveryDate}
                            </span>
                          </div>
                          <div className="mt-3 flex justify-end space-x-2">
                            <Button variant="outline" size="sm" asChild>
                              <Link to={`/deliveries/${delivery.id}`}>
                                Détails
                              </Link>
                            </Button>
                            <Button variant="outline" size="sm" asChild>
                              <Link
                                to={`/deliveries/new?duplicate=${delivery.id}`}
                              >
                                <Plus className="mr-1 h-4 w-4" />
                                Recréer
                              </Link>
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              ) : (
                <Card>
                  <CardContent className="py-12 text-center">
                    <Package className="mx-auto h-12 w-12 text-muted-foreground" />
                    <h3 className="mt-4 text-lg font-medium">
                      Aucune livraison dans l'historique
                    </h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Vos livraisons passées apparaîtront ici.
                    </p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default DeliveriesPage;
