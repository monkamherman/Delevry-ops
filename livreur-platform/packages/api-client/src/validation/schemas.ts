import { z } from 'zod';

/**
 * Schéma de base pour une réponse d'erreur API
 */
export const errorResponseSchema = z.object({
  /**
   * Code d'erreur unique identifiant le type d'erreur
   * @example "VALIDATION_ERROR"
   */
  code: z.string(),
  
  /**
   * Message d'erreur lisible par l'humain
   * @example "La validation a échoué"
   */
  message: z.string(),
  
  /**
   * Détails supplémentaires sur l'erreur (optionnel)
   */
  details: z.record(z.any()).optional(),
  
  /**
   * Erreurs de validation (optionnel)
   */
  errors: z.record(z.array(z.string())).optional(),
  
  /**
   * Horodatage de l'erreur
   * @example "2023-04-01T12:00:00Z"
   */
  timestamp: z.string().datetime().optional(),
});

/**
 * Schéma pour une réponse paginée
 */
export const paginatedResponseSchema = <T extends z.ZodTypeAny>(itemSchema: T) => {
  return z.object({
    /**
     * Tableau des éléments de la page courante
     */
    data: z.array(itemSchema),
    
    /**
     * Métadonnées de pagination
     */
    meta: z.object({
      /**
       * Numéro de la page courante (commence à 1)
       */
      currentPage: z.number().int().positive(),
      
      /**
       * Nombre d'éléments par page
       */
      perPage: z.number().int().positive(),
      
      /**
       * Nombre total d'éléments
       */
      total: z.number().int().nonnegative(),
      
      /**
       * Nombre total de pages
       */
      totalPages: z.number().int().positive(),
      
      /**
       * Lien vers la page suivante (si elle existe)
       */
      nextPage: z.string().url().optional(),
      
      /**
       * Lien vers la page précédente (si elle existe)
       */
      prevPage: z.string().url().optional(),
    }),
  });
};

/**
 * Schéma pour une réponse de succès générique
 */
export const successResponseSchema = <T extends z.ZodTypeAny>(dataSchema: T) => {
  return z.object({
    /**
     * Indique si la requête a réussi
     */
    success: z.literal(true),
    
    /**
     * Données de la réponse
     */
    data: dataSchema,
    
    /**
     * Métadonnées supplémentaires (optionnel)
     */
    meta: z.record(z.any()).optional(),
  });
};

/**
 * Schéma pour une réponse d'erreur générique
 */
export const errorResponseWrapperSchema = z.object({
  /**
   * Indique si la requête a échoué
   */
  success: z.literal(false),
  
  /**
   * Détails de l'erreur
   */
  error: errorResponseSchema,
});

/**
 * Schéma pour une réponse API générique
 */
export const apiResponseSchema = <T extends z.ZodTypeAny>(dataSchema: T) => {
  return z.union([
    successResponseSchema(dataSchema),
    errorResponseWrapperSchema,
  ]);
};

/**
 * Schéma pour une réponse de liste paginée
 */
export const paginatedApiResponseSchema = <T extends z.ZodTypeAny>(itemSchema: T) => {
  return apiResponseSchema(paginatedResponseSchema(itemSchema));
};

/**
 * Schéma pour une réponse vide (sans données)
 */
export const emptyResponseSchema = apiResponseSchema(z.void());

/**
 * Type pour une réponse d'erreur API
 */
export type ErrorResponse = z.infer<typeof errorResponseSchema>;

/**
 * Type pour une réponse paginée
 */
export type PaginatedResponse<T> = z.infer<ReturnType<typeof paginatedResponseSchema<z.ZodType<T>>>>;

/**
 * Type pour une réponse API validée
 * À utiliser pour les réponses qui ont été validées par le validateur
 */
export type ValidatedApiResponse<T> = 
  | { success: true; data: T; meta?: Record<string, any> }
  | { success: false; error: ErrorResponse };
