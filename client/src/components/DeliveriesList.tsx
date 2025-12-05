import { useState } from 'react';
import { useDeliveries, Delivery } from '../hooks/useDeliveries';
import { useDeliveryMutations } from '../hooks/useDeliveryMutations';
import { Button } from './ui/button';
import { Pencil, Trash2, Plus } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

const statusColors = {
  en_attente: 'bg-yellow-100 text-yellow-800',
  en_cours: 'bg-blue-100 text-blue-800',
  livree: 'bg-green-100 text-green-800',
  annulee: 'bg-red-100 text-red-800',
};

const statusLabels = {
  en_attente: 'En attente',
  en_cours: 'En cours',
  livree: 'Livrée',
  annulee: 'Annulée',
};

const DeliveriesList = () => {
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Delivery>>({
    status: 'en_attente',
    adresse: '',
    clientId: 'client-1', // À remplacer par l'ID du client connecté
  });

  const { data: deliveries, isLoading, error } = useDeliveries();
  const { createDelivery, updateDelivery, deleteDelivery } = useDeliveryMutations();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingId) {
      await updateDelivery.mutateAsync({ ...formData, id: editingId });
      setEditingId(null);
    } else {
      await createDelivery.mutateAsync({
        ...formData as Omit<Delivery, 'id' | 'dateCreation'>,
        dateCreation: new Date().toISOString(),
      });
      setIsCreating(false);
    }
    
    setFormData({
      status: 'en_attente',
      adresse: '',
      clientId: 'client-1',
    });
  };

  const handleEdit = (delivery: Delivery) => {
    setEditingId(delivery.id);
    setFormData({
      status: delivery.status,
      adresse: delivery.adresse,
      clientId: delivery.clientId,
    });
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette livraison ?')) {
      await deleteDelivery.mutateAsync(id);
    }
  };

  if (isLoading) {
    return <div className="p-4">Chargement des livraisons en cours...</div>;
  }

  if (error) {
    return (
      <div className="p-4 text-red-500">
        Erreur lors du chargement des livraisons: {error.message}
      </div>
    );
  }

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Gestion des livraisons</h2>
        <Button onClick={() => setIsCreating(!isCreating)}>
          <Plus className="mr-2 h-4 w-4" />
          {isCreating ? 'Annuler' : 'Nouvelle livraison'}
        </Button>
      </div>

      {(isCreating || editingId) && (
        <form onSubmit={handleSubmit} className="mb-8 p-4 bg-gray-50 rounded-lg">
          <h3 className="font-semibold mb-4">
            {editingId ? 'Modifier la livraison' : 'Nouvelle livraison'}
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Adresse de livraison
              </label>
              <input
                type="text"
                name="adresse"
                value={formData.adresse || ''}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Statut
              </label>
              <select
                name="status"
                value={formData.status || 'en_attente'}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md"
                required
              >
                {Object.entries(statusLabels).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="mt-4 flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setIsCreating(false);
                setEditingId(null);
                setFormData({
                  status: 'en_attente',
                  adresse: '',
                  clientId: 'client-1',
                });
              }}
            >
              Annuler
            </Button>
            <Button type="submit" disabled={createDelivery.isPending || updateDelivery.isPending}>
              {editingId ? 'Mettre à jour' : 'Créer'}
            </Button>
          </div>
        </form>
      )}

      <div className="space-y-4">
        {deliveries && deliveries.length > 0 ? (
          deliveries.map((delivery) => (
            <div
              key={delivery.id}
              className="p-4 border rounded-lg shadow-sm hover:shadow-md transition-shadow bg-white"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <h3 className="font-semibold">Livraison #{delivery.id.slice(0, 6)}</h3>
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        statusColors[delivery.status as keyof typeof statusColors] || 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {statusLabels[delivery.status as keyof typeof statusLabels] || delivery.status}
                    </span>
                  </div>
                  <p className="text-gray-600 mt-1">{delivery.adresse}</p>
                  {delivery.dateCreation && (
                    <p className="text-sm text-gray-500 mt-2">
                      Créée le {format(new Date(delivery.dateCreation), 'PPpp', { locale: fr })}
                    </p>
                  )}
                </div>
                
                <div className="flex space-x-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleEdit(delivery)}
                    className="text-blue-600 hover:bg-blue-50"
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(delivery.id)}
                    className="text-red-600 hover:bg-red-50"
                    disabled={deleteDelivery.isPending}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">Aucune livraison trouvée.</p>
            <Button 
              onClick={() => setIsCreating(true)}
              className="mt-4"
              variant="outline"
            >
              <Plus className="mr-2 h-4 w-4" />
              Créer une livraison
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DeliveriesList;
