import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

// Type pour une livraison
export interface Delivery {
  id: string;
  status: 'en_attente' | 'en_cours' | 'livree' | 'annulee';
  adresse: string;
  clientId: string;
  livreurId?: string;
  dateCreation: string;
  dateLivraisonPrevue?: string;
}

// Clé de requête pour le cache
export const DELIVERIES_QUERY_KEY = 'deliveries';

// Fonction pour récupérer les livraisons
const fetchDeliveries = async (): Promise<Delivery[]> => {
  // Remplacez l'URL par votre véritable endpoint API
  const { data } = await axios.get<Delivery[]>('http://localhost:3000/api/deliveries');
  return data;
};

// Hook personnalisé pour récupérer les livraisons
export const useDeliveries = () => {
  return useQuery({
    queryKey: [DELIVERIES_QUERY_KEY],
    queryFn: fetchDeliveries,
    // Options supplémentaires
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
