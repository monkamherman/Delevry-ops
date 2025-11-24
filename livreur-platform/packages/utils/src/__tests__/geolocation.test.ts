/// <reference types="jest" />
/// <reference types="node" />

import { 
  calculateDistance, 
  calculateTravelTime, 
  isValidPosition, 
  calculateMidpoint 
} from '../geolocation';
import { Position } from '@livreur/core-types';

describe('Géolocalisation', () => {
  const now = new Date();
  const paris: Position = { 
    latitude: 48.8566, 
    longitude: 2.3522,
    timestamp: now
  };  // Paris
  const lyon: Position = { 
    latitude: 45.7640, 
    longitude: 4.8357,
    timestamp: new Date(now.getTime() + 1000)
  };   // Lyon
  const marseille: Position = { 
    latitude: 43.2965, 
    longitude: 5.3698,
    timestamp: new Date(now.getTime() + 2000)
  }; // Marseille

  describe('calculateDistance', () => {
    it('calcule correctement la distance entre deux villes', () => {
      // Distance approximative Paris-Lyon
      const distance = calculateDistance(paris, lyon);
      expect(distance).toBeGreaterThan(390);
      expect(distance).toBeLessThan(410);
    });

    it('retourne 0 pour la même position', () => {
      const distance = calculateDistance(paris, { ...paris });
      expect(distance).toBe(0);
    });
  });

  describe('calculateTravelTime', () => {
    it('calcule correctement le temps de trajet', () => {
      // 100km à 50 km/h = 2h = 120 minutes
      const time = calculateTravelTime(100, 50);
      expect(time).toBe(120);
    });

    it('gère la vitesse par défaut (30 km/h)', () => {
      // 30km à 30 km/h = 1h = 60 minutes
      const time = calculateTravelTime(30);
      expect(time).toBe(60);
    });

    it('lève une erreur pour une vitesse négative', () => {
      expect(() => calculateTravelTime(100, -10)).toThrow('La vitesse moyenne doit être supérieure à 0');
    });
  });

  describe('isValidPosition', () => {
    it('valide une position correcte', () => {
      expect(isValidPosition(paris)).toBe(true);
    });

    it('invalide une latitude incorrecte', () => {
      expect(isValidPosition({ 
        latitude: -91, 
        longitude: 0,
        timestamp: new Date() 
      })).toBe(false);
      expect(isValidPosition({ 
        latitude: 91, 
        longitude: 0,
        timestamp: new Date() 
      })).toBe(false);
    });

    it('invalide une longitude incorrecte', () => {
      expect(isValidPosition({ 
        latitude: 0, 
        longitude: -181,
        timestamp: new Date() 
      })).toBe(false);
      expect(isValidPosition({ 
        latitude: 0, 
        longitude: 181,
        timestamp: new Date() 
      })).toBe(false);
    });
  });

  describe('calculateMidpoint', () => {
    it('calcule correctement le point médian entre deux points', () => {
      const pointA: Position = { 
        latitude: 0, 
        longitude: 0, 
        timestamp: new Date() 
      };
      const pointB: Position = { 
        latitude: 10, 
        longitude: 10, 
        timestamp: new Date(Date.now() + 1000) 
      };
      const mid = calculateMidpoint([pointA, pointB]);
      
      expect(mid).toMatchObject({
        latitude: 5,
        longitude: 5
      });
    });

    it('retourne null pour un tableau vide', () => {
      expect(calculateMidpoint([])).toBeNull();
    });

    it('retourne la même position pour un seul point', () => {
      const point: Position = { 
        latitude: 10, 
        longitude: 20, 
        timestamp: new Date() 
      };
      const result = calculateMidpoint([point]);
      expect(result).toMatchObject({
        latitude: point.latitude,
        longitude: point.longitude
      });
    });

    it('calcule correctement avec plusieurs points', () => {
      const points: Position[] = [
        { 
          latitude: 0, 
          longitude: 0, 
          timestamp: new Date() 
        },
        { 
          latitude: 10, 
          longitude: 10, 
          timestamp: new Date(Date.now() + 1000) 
        },
        { 
          latitude: 20, 
          longitude: 20, 
          timestamp: new Date(Date.now() + 2000) 
        }
      ];
      
      const mid = calculateMidpoint(points);
      expect(mid).toMatchObject({
        latitude: 10,
        longitude: 10
      });
    });
  });
});
