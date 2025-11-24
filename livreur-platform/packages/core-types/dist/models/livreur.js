"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LivreurStatus = void 0;
/**
 * Statuts possibles d'un livreur
 */
var LivreurStatus;
(function (LivreurStatus) {
    /**
     * En attente de validation
     */
    LivreurStatus["PENDING"] = "PENDING";
    /**
     * Actif et disponible pour les livraisons
     */
    LivreurStatus["AVAILABLE"] = "AVAILABLE";
    /**
     * En cours de livraison
     */
    LivreurStatus["ON_DELIVERY"] = "ON_DELIVERY";
    /**
     * En pause
     */
    LivreurStatus["ON_BREAK"] = "ON_BREAK";
    /**
     * Hors service
     */
    LivreurStatus["OFFLINE"] = "OFFLINE";
    /**
     * Compte désactivé
     */
    LivreurStatus["DISABLED"] = "DISABLED";
})(LivreurStatus || (exports.LivreurStatus = LivreurStatus = {}));
