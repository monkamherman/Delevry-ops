"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeliveryPriority = exports.DeliveryStatus = void 0;
var DeliveryStatus;
(function (DeliveryStatus) {
    DeliveryStatus["PENDING"] = "PENDING";
    DeliveryStatus["ASSIGNED"] = "ASSIGNED";
    DeliveryStatus["IN_PROGRESS"] = "IN_PROGRESS";
    DeliveryStatus["DELIVERED"] = "DELIVERED";
    DeliveryStatus["CANCELLED"] = "CANCELLED";
    DeliveryStatus["FAILED"] = "FAILED";
})(DeliveryStatus || (exports.DeliveryStatus = DeliveryStatus = {}));
var DeliveryPriority;
(function (DeliveryPriority) {
    DeliveryPriority["LOW"] = "LOW";
    DeliveryPriority["NORMAL"] = "NORMAL";
    DeliveryPriority["HIGH"] = "HIGH";
    DeliveryPriority["URGENT"] = "URGENT";
})(DeliveryPriority || (exports.DeliveryPriority = DeliveryPriority = {}));
//# sourceMappingURL=delivery.model.js.map