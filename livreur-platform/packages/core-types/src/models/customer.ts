import { Delivery } from './delivery';
import { UserRole } from '../enums';

/**
 * Représente un client dans le système
 */
export interface Customer {
  /**
   * Identifiant unique du client
   */
  id: string;

  /**
   * Prénom du client
   */
  firstName: string;

  /**
   * Nom de famille du client
   */
  lastName: string;

  /**
   * Adresse email du client
   */
  email: string;

  /**
   * Numéro de téléphone du client
   */
  phone: string;

  /**
   * Entreprise du client (si applicable)
   */
  company?: string;

  /**
   * Adresse par défaut du client
   */
  defaultAddress?: {
    street: string;
    city: string;
    postalCode: string;
    country: string;
    details?: string;
    isDefault: boolean;
  };

  /**
   * Autres adresses enregistrées
   */
  additionalAddresses?: Array<{
    id: string;
    street: string;
    city: string;
    postalCode: string;
    country: string;
    details?: string;
    isDefault: boolean;
    label?: string; // Ex: "Domicile", "Bureau", etc.
  }>;

  /**
   * Préférences de livraison
   */
  preferences?: {
    /**
     * Instructions spéciales pour la livraison
     */
    deliveryInstructions?: string;
    
    /**
     * Préfère ne pas être appelé avant la livraison
     */
    noCallBeforeDelivery?: boolean;
    
    /**
     * Autorise la livraison sans signature
     */
    allowUnattendedDelivery?: boolean;
    
    /**
     * Lieu de dépôt sécurisé si absent
     */
    safePlace?: string;
  };

  /**
   * Historique des livraisons (références)
   */
  deliveryHistory: Array<{
    id: string;
    reference: string;
    status: string;
    deliveredAt: string;
    rating?: number;
  }>;

  /**
   * Statistiques du client
   */
  stats: {
    /**
     * Nombre total de livraisons
     */
    totalDeliveries: number;
    
    /**
     * Montant total dépensé
     */
    totalSpent: number;
    
    /**
     * Note moyenne des livraisons (1-5)
     */
    averageRating?: number;
    
    /**
     * Date de la première commande
     */
    firstOrderDate?: string;
    
    /**
     * Date de la dernière commande
     */
    lastOrderDate?: string;
  };

  /**
   * Métadonnées supplémentaires
   */
  metadata?: Record<string, unknown>;

  /**
   * Date de création du compte
   */
  createdAt: string;

  /**
   * Date de dernière mise à jour
   */
  updatedAt: string;

  /**
   * Indique si le compte est actif
   */
  isActive: boolean;
}

/**
 * Données requises pour créer un nouveau client
 */
export interface CreateCustomerDto {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company?: string;
  password: string;
  address?: {
    street: string;
    city: string;
    postalCode: string;
    country: string;
    details?: string;
  };
  preferences?: {
    deliveryInstructions?: string;
    noCallBeforeDelivery?: boolean;
    allowUnattendedDelivery?: boolean;
    safePlace?: string;
  };
}

/**
 * Données pour mettre à jour un client existant
 */
export interface UpdateCustomerDto {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  company?: string | null;
  isActive?: boolean;
  preferences?: {
    deliveryInstructions?: string | null;
    noCallBeforeDelivery?: boolean | null;
    allowUnattendedDelivery?: boolean | null;
    safePlace?: string | null;
  };
}

/**
 * Données pour ajouter une adresse à un client
 */
export interface AddCustomerAddressDto {
  street: string;
  city: string;
  postalCode: string;
  country: string;
  details?: string;
  isDefault?: boolean;
  label?: string;
}

/**
 * Données pour mettre à jour une adresse de client
 */
export interface UpdateCustomerAddressDto {
  street?: string;
  city?: string;
  postalCode?: string;
  country?: string;
  details?: string | null;
  isDefault?: boolean;
  label?: string | null;
}

/**
 * Filtres pour la recherche de clients
 */
export interface CustomerFilters {
  /**
   * Recherche par nom, prénom, email ou entreprise
   */
  search?: string;
  
  /**
   * Filtre par statut actif/inactif
   */
  isActive?: boolean;
  
  /**
   * Filtre par ville
   */
  city?: string;
  
  /**
   * Filtre par code postal
   */
  postalCode?: string;
  
  /**
   * Filtre par nombre minimum de commandes
   */
  minOrders?: number;
  
  /**
   * Trier par champ spécifique
   */
  sortBy?: 'name' | 'lastOrderDate' | 'totalSpent' | 'createdAt';
  
  /**
   * Ordre de tri
   */
  sortOrder?: 'asc' | 'desc';
}

/**
 * Résumé des statistiques clients
 */
export interface CustomerStats {
  /**
   * Nombre total de clients
   */
  total: number;
  
  /**
   * Nombre de nouveaux clients (cette période)
   */
  newCustomers: number;
  
  /**
   * Taux de rétention des clients
   */
  retentionRate: number;
  
  /**
   * Valeur moyenne des commandes
   */
  averageOrderValue: number;
  
  /**
   * Répartition par ville
   */
  byCity: Array<{
    city: string;
    count: number;
    percentage: number;
  }>;
  
  /**
   * Évolution du nombre de clients dans le temps
   */
  growth: Array<{
    period: string;
    count: number;
    change: number;
  }>;
}

/**
 * Informations de profil client pour l'affichage
 */
export interface CustomerProfile extends Omit<Customer, 'password' | 'metadata'> {
  /**
   * Rôle de l'utilisateur
   */
  role: UserRole;
  
  /**
   * Dernières livraisons (détaillées)
   */
  recentDeliveries: Array<{
    id: string;
    reference: string;
    status: string;
    createdAt: string;
    deliveredAt?: string;
    rating?: number;
    livreur?: {
      id: string;
      name: string;
      phone: string;
    };
  }>;
  
  /**
   * Adresses formatées pour l'affichage
   */
  formattedAddresses: Array<{
    id: string;
    label: string;
    fullAddress: string;
    isDefault: boolean;
  }>;
}
