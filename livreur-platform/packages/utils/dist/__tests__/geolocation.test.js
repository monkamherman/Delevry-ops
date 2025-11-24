"use strict";
/// <reference types="jest" />
/// <reference types="node" />
Object.defineProperty(exports, "__esModule", { value: true });
const geolocation_1 = require("../geolocation");
describe("Géolocalisation", () => {
    const now = new Date();
    const paris = {
        latitude: 48.8566,
        longitude: 2.3522,
        timestamp: now.toISOString(),
    }; // Paris
    const lyon = {
        latitude: 45.764,
        longitude: 4.8357,
        timestamp: new Date(now.getTime() + 1000).toISOString(),
    }; // Lyon
    const marseille = {
        latitude: 43.2965,
        longitude: 5.3698,
        timestamp: new Date(now.getTime() + 2000).toISOString(),
    }; // Marseille
    describe("calculateDistance", () => {
        it("calcule correctement la distance entre deux villes", () => {
            // Distance approximative Paris-Lyon
            const distance = (0, geolocation_1.calculateDistance)(paris, lyon);
            expect(distance).toBeGreaterThan(390);
            expect(distance).toBeLessThan(410);
        });
        it("retourne 0 pour la même position", () => {
            const distance = (0, geolocation_1.calculateDistance)(paris, { ...paris });
            expect(distance).toBe(0);
        });
    });
    describe("calculateTravelTime", () => {
        it("calcule correctement le temps de trajet", () => {
            // 100km à 50 km/h = 2h = 120 minutes
            const time = (0, geolocation_1.calculateTravelTime)(100, 50);
            expect(time).toBe(120);
        });
        it("gère la vitesse par défaut (30 km/h)", () => {
            // 30km à 30 km/h = 1h = 60 minutes
            const time = (0, geolocation_1.calculateTravelTime)(30);
            expect(time).toBe(60);
        });
        it("lève une erreur pour une vitesse négative", () => {
            expect(() => (0, geolocation_1.calculateTravelTime)(100, -10)).toThrow("La vitesse moyenne doit être supérieure à 0");
        });
    });
    describe("isValidPosition", () => {
        it("valide une position correcte", () => {
            expect((0, geolocation_1.isValidPosition)(paris)).toBe(true);
        });
        it("invalide une latitude incorrecte", () => {
            expect((0, geolocation_1.isValidPosition)({
                latitude: -91,
                longitude: 0,
                timestamp: new Date().toISOString(),
            })).toBe(false);
            expect((0, geolocation_1.isValidPosition)({
                latitude: 91,
                longitude: 0,
                timestamp: new Date().toISOString(),
            })).toBe(false);
        });
        it("invalide une longitude incorrecte", () => {
            expect((0, geolocation_1.isValidPosition)({
                latitude: 0,
                longitude: -181,
                timestamp: new Date().toISOString(),
            })).toBe(false);
            expect((0, geolocation_1.isValidPosition)({
                latitude: 0,
                longitude: 181,
                timestamp: new Date().toISOString(),
            })).toBe(false);
        });
    });
    describe("calculateMidpoint", () => {
        it("calcule correctement le point médian entre deux points", () => {
            const pointA = {
                latitude: 0,
                longitude: 0,
                timestamp: new Date().toISOString(),
            };
            const pointB = {
                latitude: 10,
                longitude: 10,
                timestamp: new Date(Date.now() + 1000).toISOString(),
            };
            const mid = (0, geolocation_1.calculateMidpoint)([pointA, pointB]);
            expect(mid).toMatchObject({
                latitude: 5,
                longitude: 5,
            });
        });
        it("retourne null pour un tableau vide", () => {
            expect((0, geolocation_1.calculateMidpoint)([])).toBeNull();
        });
        it("retourne la même position pour un seul point", () => {
            const point = {
                latitude: 10,
                longitude: 20,
                timestamp: new Date().toISOString(),
            };
            const result = (0, geolocation_1.calculateMidpoint)([point]);
            expect(result).toMatchObject({
                latitude: point.latitude,
                longitude: point.longitude,
            });
        });
        it("calcule correctement avec plusieurs points", () => {
            const points = [
                {
                    latitude: 0,
                    longitude: 0,
                    timestamp: new Date().toDateString(),
                },
                {
                    latitude: 10,
                    longitude: 10,
                    timestamp: new Date(Date.now() + 1000).toISOString(),
                },
                {
                    latitude: 20,
                    longitude: 20,
                    timestamp: new Date(Date.now() + 2000).toDateString(),
                },
            ];
            const mid = (0, geolocation_1.calculateMidpoint)(points);
            expect(mid).toMatchObject({
                latitude: 10,
                longitude: 10,
            });
        });
    });
});
