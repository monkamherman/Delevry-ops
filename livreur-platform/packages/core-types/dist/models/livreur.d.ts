import { Position } from './position';
export interface Livreur {
    /**
     * Identifiant unique du livreur
     * @example "5f8d0a4e3d8f4b2d1c7e3f2a"
     */
    id: string;
    /**
     * Prénom du livreur
     * @example "Jean"
     */
    firstName: string;
    /**
     * Nom de famille du livreur
     * @example "Dupont"
     */
    lastName: string;
    /**
     * Numéro de téléphone du livreur
     * @example "+33612345678"
     */
    phone: string;
    /**
     * Email du livreur
     * @example "jean.dupont@example.com"
     */
    email: string;
    /**
     * Statut actuel du livreur
     */
    status: LivreurStatus;
    /**
     * Position actuelle du livreur (si disponible)
     */
    currentPosition?: Position;
    /**
     * Dernière mise à jour de la position
     */
    lastPositionUpdate?: string;
    /**
     * Véhicule utilisé par le livreur
     */
    vehicle: {
        /**
         * Type de véhicule
         * @example "bike", "scooter", "car"
         */
        type: string;
        /**
         * Identifiant du véhicule
         * @example "AB-123-CD"
         */
        identifier?: string;
        /**
         * Capacité du véhicule (en kg)
         */
        capacity?: number;
    };
    /**
     * Indique si le livreur est actuellement en service
     */
    isActive: boolean;
    /**
     * Date de création du profil
     */
    createdAt: string;
    /**
     * Dernière mise à jour du profil
     */
    updatedAt: string;
}
/**
 * Statuts possibles d'un livreur
 */
export declare enum LivreurStatus {
    /**
     * En attente de validation
     */
    PENDING = "PENDING",
    /**
     * Actif et disponible pour les livraisons
     */
    AVAILABLE = "AVAILABLE",
    /**
     * En cours de livraison
     */
    ON_DELIVERY = "ON_DELIVERY",
    /**
     * En pause
     */
    ON_BREAK = "ON_BREAK",
    /**
     * Hors service
     */
    OFFLINE = "OFFLINE",
    /**
     * Compte désactivé
     */
    DISABLED = "DISABLED"
}
/**
 * Données requises pour créer un nouveau livreur
 */
export interface CreateLivreurDto {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    vehicle: {
        type: string;
        identifier?: string;
        capacity?: number;
    };
}
/**
 * Données pour mettre à jour un livreur existant
 */
export interface UpdateLivreurDto {
    firstName?: string;
    lastName?: string;
    phone?: string;
    status?: LivreurStatus;
    vehicle?: {
        type?: string;
        identifier?: string | null;
        capacity?: number | null;
    };
    isActive?: boolean;
}
/**
 * Filtres pour la recherche de livreurs
 */
export interface LivreurFilters {
    /**
     * Filtre par statut
     */
    status?: LivreurStatus;
    /**
     * Filtre par type de véhicule
     */
    vehicleType?: string;
    /**
     * Filtre par disponibilité
     */
    isActive?: boolean;
    /**
     * Recherche par nom, prénom ou email
     */
    search?: string;
}
