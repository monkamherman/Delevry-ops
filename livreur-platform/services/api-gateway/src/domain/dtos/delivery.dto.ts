import { z } from "zod";

// Schéma pour l'adresse de livraison
export const addressSchema = z.object({
  street: z.string().min(1, "La rue est requise"),
  city: z.string().min(1, "La ville est requise"),
  postalCode: z.string().min(1, "Le code postal est requis"),
  country: z.string().min(1, "Le pays est requis"),
  formatted: z.string().optional(),
  coordinates: z
    .object({
      lat: z.number(),
      lng: z.number(),
    })
    .optional(),
});

export type AddressDto = z.infer<typeof addressSchema>;

// Schéma pour la position GPS
export const positionSchema = z.object({
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
  timestamp: z.string().optional(),
  accuracy: z.number().optional(),
  altitude: z.number().optional(),
  heading: z.number().optional(),
  speed: z.number().optional(),
});

export type PositionDto = z.infer<typeof positionSchema>;

// Schéma pour l'étape de route
export const routeStepSchema = z.object({
  instruction: z.string(),
  distance: z.number(),
  duration: z.number(),
  polyline: z.string(),
});

export type RouteStepDto = z.infer<typeof routeStepSchema>;

// Schéma pour l'itinéraire optimisé
export const optimizedRouteSchema = z.object({
  waypoints: z.array(positionSchema),
  totalDistance: z.number(),
  estimatedDuration: z.number(),
  polyline: z.string(),
  steps: z.array(routeStepSchema),
});

export type OptimizedRouteDto = z.infer<typeof optimizedRouteSchema>;

// Énumération pour les statuts de livraison
export const DeliveryStatusEnum = z.enum([
  "PENDING",
  "ASSIGNED",
  "IN_PROGRESS",
  "DELIVERED",
  "CANCELLED",
  "FAILED",
]);

export type DeliveryStatus = z.infer<typeof DeliveryStatusEnum>;

// Schéma pour la création de livraison
export const createDeliverySchema = z.object({
  clientId: z.string().uuid("ID client invalide"),
  addresses: z.array(addressSchema).min(2, "Au moins 2 adresses sont requises"),
  priority: z
    .enum(["LOW", "NORMAL", "HIGH", "URGENT"])
    .optional()
    .default("NORMAL"),
  packageInfo: z
    .object({
      weight: z.number().positive().optional(),
      dimensions: z
        .object({
          length: z.number().positive().optional(),
          width: z.number().positive().optional(),
          height: z.number().positive().optional(),
        })
        .optional(),
      description: z.string().optional(),
      specialInstructions: z.string().optional(),
    })
    .optional(),
  timeWindow: z
    .object({
      start: z.string(),
      end: z.string(),
    })
    .optional(),
  notes: z.string().optional(),
});

export type CreateDeliveryDto = z.infer<typeof createDeliverySchema>;

// Schéma pour la mise à jour de livraison
export const updateDeliverySchema = createDeliverySchema
  .partial()
  .omit({ clientId: true });

export type UpdateDeliveryDto = z.infer<typeof updateDeliverySchema>;

// Schéma pour l'assignation de livraison
export const assignDeliverySchema = z.object({
  livreurId: z.string().uuid("ID livreur invalide"),
});

export type AssignDeliveryDto = z.infer<typeof assignDeliverySchema>;

// Schéma pour la mise à jour de statut
export const updateStatusSchema = z.object({
  status: DeliveryStatusEnum,
  notes: z.string().optional(),
  location: positionSchema.optional(),
  photoUrl: z.string().url().optional(),
  signature: z.string().optional(),
});

export type UpdateStatusDto = z.infer<typeof updateStatusSchema>;

// Schéma pour les requêtes de filtrage
export const deliveryQuerySchema = z.object({
  page: z.coerce.number().positive().optional().default(1),
  limit: z.coerce.number().positive().max(100).optional().default(20),
  status: DeliveryStatusEnum.optional(),
  clientId: z.string().uuid().optional(),
  livreurId: z.string().uuid().optional(),
  dateFrom: z.string().optional(),
  dateTo: z.string().optional(),
  priority: z.enum(["LOW", "NORMAL", "HIGH", "URGENT"]).optional(),
  sortBy: z
    .enum(["createdAt", "updatedAt", "priority", "status"])
    .optional()
    .default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).optional().default("desc"),
});

export type DeliveryQueryDto = z.infer<typeof deliveryQuerySchema>;

// Schéma pour la réponse de livraison
export const deliveryResponseSchema = z.object({
  id: z.string().uuid(),
  clientId: z.string().uuid(),
  livreurId: z.string().uuid().nullable(),
  status: DeliveryStatusEnum,
  addresses: z.array(addressSchema),
  priority: z.enum(["LOW", "NORMAL", "HIGH", "URGENT"]),
  packageInfo: z
    .object({
      weight: z.number().positive().nullable(),
      dimensions: z
        .object({
          length: z.number().positive().nullable(),
          width: z.number().positive().nullable(),
          height: z.number().positive().nullable(),
        })
        .nullable(),
      description: z.string().nullable(),
      specialInstructions: z.string().nullable(),
    })
    .nullable(),
  timeWindow: z
    .object({
      start: z.string(),
      end: z.string(),
    })
    .nullable(),
  optimizedRoute: optimizedRouteSchema.nullable(),
  estimatedDuration: z.number().nullable(),
  actualDuration: z.number().nullable(),
  notes: z.string().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
  assignedAt: z.string().nullable(),
  startedAt: z.string().nullable(),
  completedAt: z.string().nullable(),
  cancelledAt: z.string().nullable(),
});

export type DeliveryResponseDto = z.infer<typeof deliveryResponseSchema>;

// Schéma pour le suivi de livraison
export const deliveryTrackingSchema = z.object({
  delivery: deliveryResponseSchema,
  currentLocation: positionSchema.nullable(),
  estimatedArrival: z.string().nullable(),
  progress: z.number().min(0).max(100),
  remainingDistance: z.number().nullable(),
  remainingTime: z.number().nullable(),
  lastUpdate: z.string(),
});

export type DeliveryTrackingDto = z.infer<typeof deliveryTrackingSchema>;

// Schéma pour la réponse paginée
export const paginatedDeliverySchema = z.object({
  items: z.array(deliveryResponseSchema),
  total: z.number(),
  page: z.number(),
  limit: z.number(),
  totalPages: z.number(),
});

export type PaginatedDeliveryDto = z.infer<typeof paginatedDeliverySchema>;
