import React, { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

type UserRole = 'client' | 'livreur' | 'admin' | null;

interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  token: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Vérifier l'état de connexion au chargement
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setIsLoading(false);
          return;
        }

        // Ici, vous devriez valider le token avec votre API
        // const userData = await validateToken(token);
        // setUser(userData);
        
        // Pour l'instant, on simule une connexion réussie
        // TODO: Remplacer par un appel API réel
        const mockUser: User = {
          id: '1',
          email: 'livreur@example.com',
          name: 'Livreur Test',
          role: 'livreur', // ou 'client' selon le rôle
          token: token
        };
        setUser(mockUser);
      } catch (err) {
        console.error('Erreur de vérification de l\'authentification:', err);
        localStorage.removeItem('token');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Simuler un appel API
      // const response = await fetch('/api/auth/login', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ email, password })
      // });
      // const data = await response.json();
      
      // Simulation de la réponse
      const mockResponse = {
        user: {
          id: '1',
          email,
          name: email.split('@')[0],
          role: email.includes('livreur') ? 'livreur' : 'client' as const,
          token: 'mock-jwt-token'
        }
      };
      
      // Stocker le token
      localStorage.setItem('token', mockResponse.user.token);
      setUser(mockResponse.user);
      
      // Rediriger en fonction du rôle
      if (mockResponse.user.role === 'livreur') {
        navigate('/livreur/dashboard');
      } else {
        navigate('/client/dashboard');
      }
    } catch (err) {
      setError('Échec de la connexion. Veuillez vérifier vos identifiants.');
      console.error('Erreur de connexion:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    navigate('/login');
  };

  const value = {
    user,
    login,
    logout,
    isAuthenticated: !!user,
    isLoading,
    error
  };

  return (
    <AuthContext.Provider value={value}>
      {!isLoading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth doit être utilisé à l\'intérieur d\'un AuthProvider');
  }
  return context;
};

// Hook personnalisé pour vérifier les rôles
export const useRole = (allowedRoles: UserRole[]) => {
  const { user } = useAuth();
  
  if (!user) return { hasRole: false, isAuthorized: false };
  
  const hasRole = allowedRoles.includes(user.role);
  
  return {
    hasRole,
    isAuthorized: hasRole,
    userRole: user.role
  };
};
