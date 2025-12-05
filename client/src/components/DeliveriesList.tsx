import { useDeliveries, Delivery } from '../hooks/useDeliveries';

const DeliveriesList = () => {
  const { data: deliveries, isLoading, error } = useDeliveries();

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

  if (!deliveries || deliveries.length === 0) {
    return <div className="p-4">Aucune livraison trouvée.</div>;
  }

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Liste des livraisons</h2>
      <div className="space-y-4">
        {deliveries.map((delivery) => (
          <div
            key={delivery.id}
            className="p-4 border rounded-lg shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold">Livraison #{delivery.id.slice(0, 6)}</h3>
                <p className="text-gray-600">{delivery.adresse}</p>
              </div>
              <span
                className={`px-2 py-1 text-xs rounded-full ${
                  delivery.status === 'livree'
                    ? 'bg-green-100 text-green-800'
                    : delivery.status === 'en_cours'
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                {delivery.status.replace('_', ' ')}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DeliveriesList;
