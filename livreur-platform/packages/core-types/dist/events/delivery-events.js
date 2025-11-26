"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeliveryEventType = void 0;
var DeliveryEventType;
(function (DeliveryEventType) {
    DeliveryEventType["DELIVERY_CREATED"] = "delivery_created";
    DeliveryEventType["DELIVERY_UPDATED"] = "delivery_updated";
    DeliveryEventType["DELIVERY_ASSIGNED"] = "delivery_assigned";
    DeliveryEventType["DELIVERY_STATUS_CHANGED"] = "delivery_status_changed";
    DeliveryEventType["DELIVERY_COMPLETED"] = "delivery_completed";
    DeliveryEventType["DELIVERY_CANCELLED"] = "delivery_cancelled";
    DeliveryEventType["DELIVERY_PROBLEM"] = "delivery_problem";
    DeliveryEventType["PROOF_OF_DELIVERY"] = "proof_of_delivery";
})(DeliveryEventType || (exports.DeliveryEventType = DeliveryEventType = {}));
