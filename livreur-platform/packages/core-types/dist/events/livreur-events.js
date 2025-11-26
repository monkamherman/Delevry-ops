"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LivreurAlertType = exports.LivreurEventType = void 0;
var LivreurEventType;
(function (LivreurEventType) {
    LivreurEventType["LIVREUR_STATUS_CHANGED"] = "livreur_status_changed";
    LivreurEventType["LIVREUR_LOCATION_UPDATE"] = "livreur_location_update";
    LivreurEventType["LIVREUR_ASSIGNED"] = "livreur_assigned";
    LivreurEventType["LIVREUR_AVAILABLE"] = "livreur_available";
    LivreurEventType["LIVREUR_OFFLINE"] = "livreur_offline";
    LivreurEventType["LIVREUR_SHIFT_STARTED"] = "livreur_shift_started";
    LivreurEventType["LIVREUR_SHIFT_ENDED"] = "livreur_shift_ended";
    LivreurEventType["LIVREUR_ALERT"] = "livreur_alert";
})(LivreurEventType || (exports.LivreurEventType = LivreurEventType = {}));
var LivreurAlertType;
(function (LivreurAlertType) {
    LivreurAlertType["EMERGENCY"] = "emergency";
    LivreurAlertType["ACCIDENT"] = "accident";
    LivreurAlertType["VEHICLE_ISSUE"] = "vehicle_issue";
    LivreurAlertType["LATE_DELIVERY"] = "late_delivery";
    LivreurAlertType["CUSTOMER_ISSUE"] = "customer_issue";
    LivreurAlertType["OTHER"] = "other";
})(LivreurAlertType || (exports.LivreurAlertType = LivreurAlertType = {}));
