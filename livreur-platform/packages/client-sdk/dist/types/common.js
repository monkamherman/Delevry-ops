"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LivreurStatus = exports.DeliveryStatus = void 0;
var DeliveryStatus;
(function (DeliveryStatus) {
    DeliveryStatus["PENDING"] = "pending";
    DeliveryStatus["ASSIGNED"] = "assigned";
    DeliveryStatus["IN_PROGRESS"] = "in_progress";
    DeliveryStatus["DELIVERED"] = "delivered";
    DeliveryStatus["CANCELLED"] = "cancelled";
    DeliveryStatus["FAILED"] = "failed";
})(DeliveryStatus || (exports.DeliveryStatus = DeliveryStatus = {}));
var LivreurStatus;
(function (LivreurStatus) {
    LivreurStatus["OFFLINE"] = "offline";
    LivreurStatus["AVAILABLE"] = "available";
    LivreurStatus["BUSY"] = "busy";
    LivreurStatus["ON_BREAK"] = "on_break";
    LivreurStatus["OFFLINE_DUTY"] = "offline_duty";
})(LivreurStatus || (exports.LivreurStatus = LivreurStatus = {}));
