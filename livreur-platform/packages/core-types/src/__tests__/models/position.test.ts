import { Position, isValidPosition } from '../../models/position';

describe('Position Model', () => {
  describe('Validation', () => {
    it('devrait valider une position valide', () => {
      const position: Position = {
        latitude: 48.8566,
        longitude: 2.3522,
        accuracy: 10,
        timestamp: new Date().toISOString(),
        altitude: 35,
        speed: 5.5,
        heading: 180
      };

      expect(position).toBeDefined();
      expect(typeof position.latitude).toBe('number');
      expect(typeof position.longitude).toBe('number');
      expect(position.latitude).toBeGreaterThanOrEqual(-90);
      expect(position.latitude).toBeLessThanOrEqual(90);
      expect(position.longitude).toBeGreaterThanOrEqual(-180);
      expect(position.longitude).toBeLessThanOrEqual(180);
      expect(isValidPosition(position)).toBe(true);
    });

    it('devrait valider une position avec les champs optionnels manquants', () => {
      const position: Position = {
        latitude: 48.8566,
        longitude: 2.3522,
        timestamp: new Date().toISOString()
      };

      expect(position).toBeDefined();
      expect(position.accuracy).toBeUndefined();
      expect(position.altitude).toBeUndefined();
      expect(position.speed).toBeUndefined();
      expect(position.heading).toBeUndefined();
    });
  });

  describe('Valeurs limites', () => {
    it('devrait accepter les valeurs limites de latitude et longitude', () => {
      const position: Position = {
        latitude: 90,
        longitude: 180,
        timestamp: new Date().toISOString()
      };

      expect(position.latitude).toBe(90);
      expect(position.longitude).toBe(180);
    });

    it('devrait lancer une erreur pour une latitude invalide', () => {
      const createInvalidPosition = () => ({
        latitude: 100, // Invalide: > 90
        longitude: 0,
        timestamp: new Date().toISOString()
      } as Position);

      const position = createInvalidPosition();
      expect(position.latitude).toBeGreaterThan(90);
    });

    it('devrait lancer une erreur pour une longitude invalide', () => {
      const createInvalidPosition = () => ({
        latitude: 0,
        longitude: 200, // Invalide: > 180
        timestamp: new Date().toISOString()
      } as Position);

      const position = createInvalidPosition();
      expect(position.longitude).toBeGreaterThan(180);
      expect(isValidPosition(position as Position)).toBe(false);
    });
  });

  describe('Timestamp', () => {
    it('devrait accepter un timestamp ISO 8601 valide', () => {
      const position: Position = {
        latitude: 48.8566,
        longitude: 2.3522,
        timestamp: '2023-11-24T09:00:00.000Z'
      };

      expect(position.timestamp).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?(Z|[+-]\d{2}:\d{2})?$/);
      expect(isValidPosition(position)).toBe(true);
    });

    it('devrait rejeter un timestamp invalide', () => {
      const position = {
        latitude: 48.8566,
        longitude: 2.3522,
        timestamp: 'invalide'
      };

      expect(isValidPosition(position as Position)).toBe(false);
    });
  });

  describe('isValidPosition', () => {
    it('devrait valider une position complète', () => {
      const position: Position = {
        latitude: 48.8566,
        longitude: 2.3522,
        timestamp: new Date().toISOString(),
        accuracy: 10,
        altitude: 35,
        speed: 5.5,
        heading: 180
      };

      expect(isValidPosition(position)).toBe(true);
    });

    it('devrait valider une position minimale', () => {
      const position: Position = {
        latitude: 48.8566,
        longitude: 2.3522,
        timestamp: new Date().toISOString()
      };

      expect(isValidPosition(position)).toBe(true);
    });

    it('devrait rejeter une position sans latitude', () => {
      const position = {
        longitude: 2.3522,
        timestamp: new Date().toISOString()
      };

      expect(isValidPosition(position as Position)).toBe(false);
    });

    it('devrait rejeter une position sans longitude', () => {
      const position = {
        latitude: 48.8566,
        timestamp: new Date().toISOString()
      };

      expect(isValidPosition(position as Position)).toBe(false);
    });

    it('devrait rejeter une position sans timestamp', () => {
      const position = {
        latitude: 48.8566,
        longitude: 2.3522
      };

      expect(isValidPosition(position as Position)).toBe(false);
    });
  });
});
