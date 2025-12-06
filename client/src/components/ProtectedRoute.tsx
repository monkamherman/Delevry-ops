import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useRole, UserRole } from '../contexts/AuthContext';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
  redirectTo?: string;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  allowedRoles = ['client', 'livreur', 'admin'],
  redirectTo = '/login',
}) => {
  const location = useLocation();
  const { isAuthorized, hasRole, isLoading } = useRole(allowedRoles);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (!isAuthorized) {
    // Rediriger vers la page de connexion avec l'URL de redirection
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  // Si l'utilisateur a le bon rôle, afficher les enfants
  return <>{children}</>;
};

// Composant spécifique pour les clients
export const ClientRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ProtectedRoute allowedRoles={['client']}>
    {children}
  </ProtectedRoute>
);

// Composant spécifique pour les livreurs
export const LivreurRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ProtectedRoute allowedRoles={['livreur']}>
    {children}
  </ProtectedRoute>
);
