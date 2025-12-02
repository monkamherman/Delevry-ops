"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const geolocation_1 = require("../geolocation");
describe('Géolocalisation', () => {
    const now = new Date();
    const yaoundeCenter = {
        latitude: 3.848,
        longitude: 11.5021,
        timestamp: now.toISOString(),
    };
    const yaoundeMarket = {
        latitude: 3.8667,
        longitude: 11.5167,
        timestamp: new Date(now.getTime() + 1000).toISOString(),
    };
    describe('calculateDistance', () => {
        it('calcule correctement la distance entre deux points connus à Yaoundé', () => {
            const distance = (0, geolocation_1.calculateDistance)(yaoundeCenter, yaoundeMarket);
            expect(distance).toBeGreaterThan(2);
            expect(distance).toBeLessThan(3);
        });
        it('retourne 0 pour la même position', () => {
            const distance = (0, geolocation_1.calculateDistance)(yaoundeCenter, { ...yaoundeCenter });
            expect(distance).toBe(0);
        });
    });
    describe('isValidPosition', () => {
        it('valide une position correcte', () => {
            expect((0, geolocation_1.isValidPosition)(yaoundeCenter)).toBe(true);
        });
        it('invalide une latitude incorrecte', () => {
            expect((0, geolocation_1.isValidPosition)({ latitude: 100, longitude: 0, timestamp: new Date().toISOString() })).toBe(false);
        });
    });
    describe('calculateMidpoint', () => {
        it('calcule correctement le point médian entre deux points', () => {
            const midpoint = (0, geolocation_1.calculateMidpoint)([yaoundeCenter, yaoundeMarket]);
            expect(midpoint).not.toBeNull();
            if (midpoint) {
                expect(midpoint.latitude).toBeCloseTo(3.8573, 3);
                expect(midpoint.longitude).toBeCloseTo(11.5094, 3);
            }
        });
        it('retourne la même position pour un seul point', () => {
            const midpoint = (0, geolocation_1.calculateMidpoint)([yaoundeCenter]);
            // Vérifie uniquement les propriétés latitude et longitude
            if (midpoint) {
                expect(midpoint.latitude).toBe(yaoundeCenter.latitude);
                expect(midpoint.longitude).toBe(yaoundeCenter.longitude);
            }
            else {
                fail('Le point médian ne devrait pas être null');
            }
        });
        it('lance une erreur si une position est invalide', () => {
            expect(() => (0, geolocation_1.calculateMidpoint)([{ latitude: 100, longitude: 0, timestamp: new Date().toISOString() }])).toThrow('Une ou plusieurs positions sont invalides');
        });
    });
});
