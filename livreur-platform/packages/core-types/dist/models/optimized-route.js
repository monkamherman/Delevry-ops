"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WaypointStatus = exports.RouteStatus = void 0;
/**
 * Statuts possibles d'un itinéraire
 */
var RouteStatus;
(function (RouteStatus) {
    /**
     * L'itinéraire est en cours de calcul
     */
    RouteStatus["CALCULATING"] = "CALCULATING";
    /**
     * L'itinéraire est planifié mais n'a pas encore commencé
     */
    RouteStatus["PLANNED"] = "PLANNED";
    /**
     * Le livreur a commencé l'itinéraire
     */
    RouteStatus["IN_PROGRESS"] = "IN_PROGRESS";
    /**
     * L'itinéraire est terminé
     */
    RouteStatus["COMPLETED"] = "COMPLETED";
    /**
     * L'itinéraire a été annulé
     */
    RouteStatus["CANCELLED"] = "CANCELLED";
    /**
     * L'itinéraire a échoué (ex: problème de calcul)
     */
    RouteStatus["FAILED"] = "FAILED";
})(RouteStatus || (exports.RouteStatus = RouteStatus = {}));
/**
 * Statuts possibles d'un point d'arrêt
 */
var WaypointStatus;
(function (WaypointStatus) {
    WaypointStatus["PENDING"] = "PENDING";
    WaypointStatus["IN_PROGRESS"] = "IN_PROGRESS";
    WaypointStatus["COMPLETED"] = "COMPLETED";
    WaypointStatus["SKIPPED"] = "SKIPPED";
    WaypointStatus["FAILED"] = "FAILED";
})(WaypointStatus || (exports.WaypointStatus = WaypointStatus = {}));
