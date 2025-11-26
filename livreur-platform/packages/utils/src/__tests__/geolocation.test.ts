import { Position } from '@livreur/core-types';
import { calculateDistance, isValidPosition, calculateMidpoint } from '../geolocation';

describe('Géolocalisation', () => {
  const now = new Date();
  const yaoundeCenter: Position = {
    latitude: 3.848,
    longitude: 11.5021,
    timestamp: now.toISOString(),
  };
  const yaoundeMarket: Position = {
    latitude: 3.8667,
    longitude: 11.5167,
    timestamp: new Date(now.getTime() + 1000).toISOString(),
  };

  describe('calculateDistance', () => {
    it('calcule correctement la distance entre deux points connus à Yaoundé', () => {
      const distance = calculateDistance(yaoundeCenter, yaoundeMarket);
      expect(distance).toBeGreaterThan(2);
      expect(distance).toBeLessThan(3);
    });

    it('retourne 0 pour la même position', () => {
      const distance = calculateDistance(yaoundeCenter, { ...yaoundeCenter });
      expect(distance).toBe(0);
    });
  });

  describe('isValidPosition', () => {
    it('valide une position correcte', () => {
      expect(isValidPosition(yaoundeCenter)).toBe(true);
    });

    it('invalide une latitude incorrecte', () => {
      expect(isValidPosition({ latitude: 100, longitude: 0, timestamp: new Date().toISOString() })).toBe(false);
    });
  });

  describe('calculateMidpoint', () => {
    it('calcule correctement le point médian entre deux points', () => {
      const midpoint = calculateMidpoint([yaoundeCenter, yaoundeMarket]);
      expect(midpoint).not.toBeNull();
      if (midpoint) {
        expect(midpoint.latitude).toBeCloseTo(3.8573, 3);
        expect(midpoint.longitude).toBeCloseTo(11.5094, 3);
      }
    });

    it('retourne la même position pour un seul point', () => {
      const midpoint = calculateMidpoint([yaoundeCenter]);
      // Vérifie uniquement les propriétés latitude et longitude
      if (midpoint) {
        expect(midpoint.latitude).toBe(yaoundeCenter.latitude);
        expect(midpoint.longitude).toBe(yaoundeCenter.longitude);
      } else {
        fail('Le point médian ne devrait pas être null');
      }
    });

    it('lance une erreur si une position est invalide', () => {
      expect(() => calculateMidpoint([{ latitude: 100, longitude: 0, timestamp: new Date().toISOString() }])).toThrow('Une ou plusieurs positions sont invalides');
    });
  });
});
