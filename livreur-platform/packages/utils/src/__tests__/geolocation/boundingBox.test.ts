import { getBoundingBox, isPointInPolygon, getGeofenceStatus } from '../../geolocation/boundingBox';
import { Position } from '@livreur/core-types';

describe('Geolocation - Bounding Box', () => {
  const testPositions: Position[] = [
    { latitude: 48.8566, longitude: 2.3522, timestamp: new Date().toISOString() }, // Paris
    { latitude: 45.7640, longitude: 4.8357, timestamp: new Date().toISOString() }, // Lyon
    { latitude: 43.2965, longitude: 5.3698, timestamp: new Date().toISOString() }, // Marseille
  ];

  const testPolygon = [
    { lat: 0, lng: 0 },
    { lat: 0, lng: 10 },
    { lat: 10, lng: 10 },
    { lat: 10, lng: 0 },
  ];

  describe('getBoundingBox', () => {
    it('calcule correctement la boîte englobante', () => {
      const bbox = getBoundingBox(testPositions);
      
      expect(bbox).not.toBeNull();
      if (bbox) {
        expect(bbox.min.lat).toBeCloseTo(43.2965, 4);
        expect(bbox.min.lng).toBeCloseTo(2.3522, 4);
        expect(bbox.max.lat).toBeCloseTo(48.8566, 4);
        expect(bbox.max.lng).toBeCloseTo(5.3698, 4);
      }
    });

    it('retourne null pour un tableau vide', () => {
      const bbox = getBoundingBox([]);
      expect(bbox).toBeNull();
    });
  });

  describe('isPointInPolygon', () => {
    it('détecte correctement un point à l\'intérieur du polygone', () => {
      const point = { lat: 5, lng: 5 };
      expect(isPointInPolygon(point, testPolygon)).toBe(true);
    });

    it('détecte correctement un point à l\'extérieur du polygone', () => {
      const point = { lat: -5, lng: -5 };
      expect(isPointInPolygon(point, testPolygon)).toBe(false);
    });
  });

  describe('getGeofenceStatus', () => {
    it('détecte correctement une position à l\'intérieur de la zone', () => {
      const position: Position = { 
        latitude: 5, 
        longitude: 5, 
        timestamp: new Date().toISOString() 
      };
      
      const geofence = testPolygon.map(p => ({
        latitude: p.lat,
        longitude: p.lng,
        timestamp: new Date().toISOString()
      }));
      
      const status = getGeofenceStatus(position, geofence);
      expect(status.isInside).toBe(true);
    });
  });
});
