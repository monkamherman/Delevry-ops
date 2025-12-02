/**
 * Interface pour les réponses paginées
 */
export interface PaginatedResponse<T> {
    /**
     * Tableau des éléments de la page courante
     */
    data: T[];
    /**
     * Nombre total d'éléments
     */
    total: number;
    /**
     * Numéro de la page courante (commence à 1)
     */
    page: number;
    /**
     * Nombre d'éléments par page
     */
    limit: number;
    /**
     * Nombre total de pages
     */
    totalPages: number;
}
/**
 * Options de pagination pour les requêtes
 */
export interface PaginationOptions {
    /**
     * Numéro de la page (commence à 1)
     * @default 1
     */
    page?: number;
    /**
     * Nombre d'éléments par page
     * @default 10
     */
    limit?: number;
    /**
     * Champ de tri
     * @default 'createdAt'
     */
    sortBy?: string;
    /**
     * Ordre de tri
     * @default 'desc'
     */
    sortOrder?: 'asc' | 'desc';
}
