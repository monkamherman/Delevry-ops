import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { Delivery, DELIVERIES_QUERY_KEY } from './useDeliveries';

// Types pour les données de création et de mise à jour
type CreateDeliveryData = Omit<Delivery, 'id' | 'dateCreation'>;
type UpdateDeliveryData = Partial<Delivery> & { id: string };

// Hook pour les opérations CRUD sur les livraisons
export const useDeliveryMutations = () => {
  const queryClient = useQueryClient();

  // Création d'une nouvelle livraison
  const createDelivery = useMutation({
    mutationFn: async (newDelivery: CreateDeliveryData) => {
      const { data } = await axios.post<Delivery>('/api/deliveries', newDelivery);
      return data;
    },
    onSuccess: () => {
      // Invalide le cache des livraisons pour forcer un rafraîchissement
      queryClient.invalidateQueries({ queryKey: [DELIVERIES_QUERY_KEY] });
    },
  });

  // Mise à jour d'une livraison existante
  const updateDelivery = useMutation({
    mutationFn: async ({ id, ...updates }: UpdateDeliveryData) => {
      const { data } = await axios.patch<Delivery>(`/api/deliveries/${id}`, updates);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [DELIVERIES_QUERY_KEY] });
    },
  });

  // Suppression d'une livraison
  const deleteDelivery = useMutation({
    mutationFn: async (id: string) => {
      await axios.delete(`/api/deliveries/${id}`);
      return id;
    },
    onSuccess: (id) => {
      // Met à jour le cache en supprimant la livraison supprimée
      queryClient.setQueryData<Delivery[]>([DELIVERIES_QUERY_KEY], (old = []) =>
        old.filter((delivery) => delivery.id !== id)
      );
    },
  });

  return {
    createDelivery,
    updateDelivery,
    deleteDelivery,
  };
};
