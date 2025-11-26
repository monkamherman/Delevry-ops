"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventChannel = void 0;
// Types d'événements WebSocket
__exportStar(require("./position-events"), exports);
__exportStar(require("./delivery-events"), exports);
__exportStar(require("./livreur-events"), exports);
// Ré-export des types d'événements pour un accès facile
__exportStar(require("../models/position"), exports);
__exportStar(require("../models/livreur"), exports);
// Types de canaux de diffusion
var EventChannel;
(function (EventChannel) {
    EventChannel["POSITION_UPDATES"] = "position_updates";
    EventChannel["DELIVERY_UPDATES"] = "delivery_updates";
    EventChannel["SYSTEM_ALERTS"] = "system_alerts";
    EventChannel["ADMIN_UPDATES"] = "admin_updates";
})(EventChannel || (exports.EventChannel = EventChannel = {}));
