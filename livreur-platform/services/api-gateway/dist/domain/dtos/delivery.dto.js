"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.paginatedDeliverySchema = exports.deliveryTrackingSchema = exports.deliveryResponseSchema = exports.deliveryQuerySchema = exports.updateStatusSchema = exports.assignDeliverySchema = exports.updateDeliverySchema = exports.createDeliverySchema = exports.DeliveryStatusEnum = exports.optimizedRouteSchema = exports.routeStepSchema = exports.positionSchema = exports.addressSchema = void 0;
const zod_1 = require("zod");
// Schéma pour l'adresse de livraison
exports.addressSchema = zod_1.z.object({
    street: zod_1.z.string().min(1, "La rue est requise"),
    city: zod_1.z.string().min(1, "La ville est requise"),
    postalCode: zod_1.z.string().min(1, "Le code postal est requis"),
    country: zod_1.z.string().min(1, "Le pays est requis"),
    formatted: zod_1.z.string().optional(),
    coordinates: zod_1.z
        .object({
        lat: zod_1.z.number(),
        lng: zod_1.z.number(),
    })
        .optional(),
});
// Schéma pour la position GPS
exports.positionSchema = zod_1.z.object({
    lat: zod_1.z.number().min(-90).max(90),
    lng: zod_1.z.number().min(-180).max(180),
    timestamp: zod_1.z.string().optional(),
    accuracy: zod_1.z.number().optional(),
    altitude: zod_1.z.number().optional(),
    heading: zod_1.z.number().optional(),
    speed: zod_1.z.number().optional(),
});
// Schéma pour l'étape de route
exports.routeStepSchema = zod_1.z.object({
    instruction: zod_1.z.string(),
    distance: zod_1.z.number(),
    duration: zod_1.z.number(),
    polyline: zod_1.z.string(),
});
// Schéma pour l'itinéraire optimisé
exports.optimizedRouteSchema = zod_1.z.object({
    waypoints: zod_1.z.array(exports.positionSchema),
    totalDistance: zod_1.z.number(),
    estimatedDuration: zod_1.z.number(),
    polyline: zod_1.z.string(),
    steps: zod_1.z.array(exports.routeStepSchema),
});
// Énumération pour les statuts de livraison
exports.DeliveryStatusEnum = zod_1.z.enum([
    "PENDING",
    "ASSIGNED",
    "IN_PROGRESS",
    "DELIVERED",
    "CANCELLED",
    "FAILED",
]);
// Schéma pour la création de livraison
exports.createDeliverySchema = zod_1.z.object({
    clientId: zod_1.z.string().uuid("ID client invalide"),
    addresses: zod_1.z.array(exports.addressSchema).min(2, "Au moins 2 adresses sont requises"),
    priority: zod_1.z
        .enum(["LOW", "NORMAL", "HIGH", "URGENT"])
        .optional()
        .default("NORMAL"),
    packageInfo: zod_1.z
        .object({
        weight: zod_1.z.number().positive().optional(),
        dimensions: zod_1.z
            .object({
            length: zod_1.z.number().positive().optional(),
            width: zod_1.z.number().positive().optional(),
            height: zod_1.z.number().positive().optional(),
        })
            .optional(),
        description: zod_1.z.string().optional(),
        specialInstructions: zod_1.z.string().optional(),
    })
        .optional(),
    timeWindow: zod_1.z
        .object({
        start: zod_1.z.string(),
        end: zod_1.z.string(),
    })
        .optional(),
    notes: zod_1.z.string().optional(),
});
// Schéma pour la mise à jour de livraison
exports.updateDeliverySchema = exports.createDeliverySchema
    .partial()
    .omit({ clientId: true });
// Schéma pour l'assignation de livraison
exports.assignDeliverySchema = zod_1.z.object({
    livreurId: zod_1.z.string().uuid("ID livreur invalide"),
});
// Schéma pour la mise à jour de statut
exports.updateStatusSchema = zod_1.z.object({
    status: exports.DeliveryStatusEnum,
    notes: zod_1.z.string().optional(),
    location: exports.positionSchema.optional(),
    photoUrl: zod_1.z.string().url().optional(),
    signature: zod_1.z.string().optional(),
});
// Schéma pour les requêtes de filtrage
exports.deliveryQuerySchema = zod_1.z.object({
    page: zod_1.z.coerce.number().positive().optional().default(1),
    limit: zod_1.z.coerce.number().positive().max(100).optional().default(20),
    status: exports.DeliveryStatusEnum.optional(),
    clientId: zod_1.z.string().uuid().optional(),
    livreurId: zod_1.z.string().uuid().optional(),
    dateFrom: zod_1.z.string().optional(),
    dateTo: zod_1.z.string().optional(),
    priority: zod_1.z.enum(["LOW", "NORMAL", "HIGH", "URGENT"]).optional(),
    sortBy: zod_1.z
        .enum(["createdAt", "updatedAt", "priority", "status"])
        .optional()
        .default("createdAt"),
    sortOrder: zod_1.z.enum(["asc", "desc"]).optional().default("desc"),
});
// Schéma pour la réponse de livraison
exports.deliveryResponseSchema = zod_1.z.object({
    id: zod_1.z.string().uuid(),
    clientId: zod_1.z.string().uuid(),
    livreurId: zod_1.z.string().uuid().nullable(),
    status: exports.DeliveryStatusEnum,
    addresses: zod_1.z.array(exports.addressSchema),
    priority: zod_1.z.enum(["LOW", "NORMAL", "HIGH", "URGENT"]),
    packageInfo: zod_1.z
        .object({
        weight: zod_1.z.number().positive().nullable(),
        dimensions: zod_1.z
            .object({
            length: zod_1.z.number().positive().nullable(),
            width: zod_1.z.number().positive().nullable(),
            height: zod_1.z.number().positive().nullable(),
        })
            .nullable(),
        description: zod_1.z.string().nullable(),
        specialInstructions: zod_1.z.string().nullable(),
    })
        .nullable(),
    timeWindow: zod_1.z
        .object({
        start: zod_1.z.string(),
        end: zod_1.z.string(),
    })
        .nullable(),
    optimizedRoute: exports.optimizedRouteSchema.nullable(),
    estimatedDuration: zod_1.z.number().nullable(),
    actualDuration: zod_1.z.number().nullable(),
    notes: zod_1.z.string().nullable(),
    createdAt: zod_1.z.string(),
    updatedAt: zod_1.z.string(),
    assignedAt: zod_1.z.string().nullable(),
    startedAt: zod_1.z.string().nullable(),
    completedAt: zod_1.z.string().nullable(),
    cancelledAt: zod_1.z.string().nullable(),
});
// Schéma pour le suivi de livraison
exports.deliveryTrackingSchema = zod_1.z.object({
    delivery: exports.deliveryResponseSchema,
    currentLocation: exports.positionSchema.nullable(),
    estimatedArrival: zod_1.z.string().nullable(),
    progress: zod_1.z.number().min(0).max(100),
    remainingDistance: zod_1.z.number().nullable(),
    remainingTime: zod_1.z.number().nullable(),
    lastUpdate: zod_1.z.string(),
});
// Schéma pour la réponse paginée
exports.paginatedDeliverySchema = zod_1.z.object({
    items: zod_1.z.array(exports.deliveryResponseSchema),
    total: zod_1.z.number(),
    page: zod_1.z.number(),
    limit: zod_1.z.number(),
    totalPages: zod_1.z.number(),
});
//# sourceMappingURL=delivery.dto.js.map