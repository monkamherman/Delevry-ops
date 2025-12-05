import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ReactNode } from 'react';

// Création d'un client de requête avec des options par défaut
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, // Désactive le rechargement des données lors du focus sur la fenêtre
      retry: 1, // Nombre de tentatives de reconnexion en cas d'échec
      staleTime: 5 * 60 * 1000, // Temps avant qu'une donnée soit considérée comme périmée (5 minutes)
    },
  },
});

interface QueryProviderProps {
  children: ReactNode;
}

export const QueryProvider = ({ children }: QueryProviderProps) => {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {import.meta.env.DEV && (
        <ReactQueryDevtools initialIsOpen={false} position="bottom-right" />
      )}
    </QueryClientProvider>
  );
};
