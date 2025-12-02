"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRole = exports.VehicleType = exports.DeliveryStatus = exports.LivreurStatus = void 0;
var livreur_1 = require("../models/livreur");
Object.defineProperty(exports, "LivreurStatus", { enumerable: true, get: function () { return livreur_1.LivreurStatus; } });
var DeliveryStatus;
(function (DeliveryStatus) {
    DeliveryStatus["PENDING"] = "PENDING";
    DeliveryStatus["ASSIGNED"] = "ASSIGNED";
    DeliveryStatus["PICKED_UP"] = "PICKED_UP";
    DeliveryStatus["IN_TRANSIT"] = "IN_TRANSIT";
    DeliveryStatus["DELIVERED"] = "DELIVERED";
    DeliveryStatus["CANCELLED"] = "CANCELLED";
    DeliveryStatus["FAILED"] = "FAILED";
})(DeliveryStatus || (exports.DeliveryStatus = DeliveryStatus = {}));
var VehicleType;
(function (VehicleType) {
    VehicleType["BIKE"] = "BIKE";
    VehicleType["SCOOTER"] = "SCOOTER";
    VehicleType["CAR"] = "CAR";
    VehicleType["VAN"] = "VAN";
    VehicleType["WALKING"] = "WALKING";
})(VehicleType || (exports.VehicleType = VehicleType = {}));
var UserRole;
(function (UserRole) {
    UserRole["ADMIN"] = "ADMIN";
    UserRole["DELIVERY_PERSON"] = "DELIVERY_PERSON";
    UserRole["CUSTOMER"] = "CUSTOMER";
})(UserRole || (exports.UserRole = UserRole = {}));
