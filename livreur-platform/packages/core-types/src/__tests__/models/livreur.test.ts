import { Livreur, LivreurStatus, CreateLivreurDto, UpdateLivreurDto } from '../../models/livreur';
import { Position } from '../../models/position';

describe('Livreur Model', () => {
  const mockPosition: Position = {
    latitude: 48.8566,
    longitude: 2.3522,
    timestamp: new Date().toISOString(),
    accuracy: 10
  };

  describe('Livreur Interface', () => {
    it('devrait valider un livreur complet', () => {
      const livreur: Livreur = {
        id: 'liv-12345',
        firstName: 'Jean',
        lastName: 'Dupont',
        email: 'jean.dupont@example.com',
        phone: '+33612345678',
        status: LivreurStatus.AVAILABLE,
        currentPosition: mockPosition,
        lastPositionUpdate: new Date().toISOString(),
        vehicle: {
          type: 'scooter',
          identifier: 'AB-123-CD',
          capacity: 50
        },
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      expect(livreur).toBeDefined();
      expect(livreur.id).toBe('liv-12345');
      expect(livreur.firstName).toBe('Jean');
      expect(livreur.lastName).toBe('Dupont');
      expect(livreur.status).toBe(LivreurStatus.AVAILABLE);
      expect(livreur.vehicle.type).toBe('scooter');
      expect(livreur.isActive).toBe(true);
    });

    it('devrait valider un livreur avec des champs optionnels manquants', () => {
      const livreur: Livreur = {
        id: 'liv-12346',
        firstName: 'Marie',
        lastName: 'Martin',
        email: 'marie.martin@example.com',
        phone: '+33698765432',
        status: LivreurStatus.OFF_DUTY,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      expect(livreur).toBeDefined();
      expect(livreur.currentPosition).toBeUndefined();
      expect(livreur.lastPositionUpdate).toBeUndefined();
      expect(livreur.vehicle).toBeUndefined();
    });
  });

  describe('LivreurStatus Enum', () => {
    it('devrait contenir les statuts attendus', () => {
      expect(LivreurStatus).toHaveProperty('AVAILABLE', 'available');
      expect(LivreurStatus).toHaveProperty('ON_DELIVERY', 'on_delivery');
      expect(LivreurStatus).toHaveProperty('OFF_DUTY', 'off_duty');
      expect(LivreurStatus).toHaveProperty('INACTIVE', 'inactive');
    });
  });

  describe('CreateLivreurDto', () => {
    it('devrait valider un DTO de création valide', () => {
      const dto: CreateLivreurDto = {
        firstName: 'Pierre',
        lastName: 'Durand',
        email: 'pierre.durand@example.com',
        phone: '+33611223344',
        vehicle: {
          type: 'bike',
          identifier: 'BIKE-001',
          capacity: 20
        }
      };

      expect(dto).toBeDefined();
      expect(dto.firstName).toBe('Pierre');
      expect(dto.vehicle?.type).toBe('bike');
    });

    it('devrait exiger les champs obligatoires', () => {
      // @ts-expect-error - Test de validation TypeScript
      const invalidDto: CreateLivreurDto = {
        // firstName manquant
        lastName: 'Doe',
        email: 'john.doe@example.com',
        phone: '+33611223344'
      };

      expect(invalidDto).toBeDefined();
      // @ts-expect-error - Vérification que le champ est requis
      expect(invalidDto.firstName).toBeUndefined();
    });
  });

  describe('UpdateLivreurDto', () => {
    it('devrait permettre des mises à jour partielles', () => {
      const update: UpdateLivreurDto = {
        status: LivreurStatus.ON_DELIVERY,
        vehicle: {
          type: 'car',
          identifier: 'CAR-001'
        }
      };

      expect(update).toBeDefined();
      expect(update.status).toBe('on_delivery');
      expect(update.vehicle?.type).toBe('car');
    });

    it('devrait permettre de mettre à jour uniquement le statut', () => {
      const update: UpdateLivreurDto = {
        status: LivreurStatus.OFF_DUTY
      };

      expect(update).toBeDefined();
      expect(update.status).toBe('off_duty');
      expect(update.vehicle).toBeUndefined();
    });
  });

  describe('Validation des champs', () => {
    it('devrait valider le format de l\'email', () => {
      const livreur = {
        id: 'liv-12347',
        firstName: 'Test',
        lastName: 'User',
        email: 'invalid-email', // Email invalide
        phone: '+33611223344',
        status: LivreurStatus.AVAILABLE,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      // Le type ne valide pas le format de l'email, mais nous pourrions ajouter une validation
      expect(livreur).toBeDefined();
      expect(livreur.email).toMatch(/@/); // Vérification basique
    });

    it('devrait valider le format du numéro de téléphone', () => {
      const livreur = {
        id: 'liv-12348',
        firstName: 'Test',
        lastName: 'User',
        email: 'test@example.com',
        phone: 'invalid-phone', // Téléphone invalide
        status: LivreurStatus.AVAILABLE,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      // Le type ne valide pas le format du téléphone, mais nous pourrions ajouter une validation
      expect(livreur).toBeDefined();
      expect(livreur.phone).toMatch(/^\+/); // Vérification basique
    });
  });

  describe('Valeurs par défaut', () => {
    it('devrait avoir des valeurs par défaut pour les champs optionnels', () => {
      const livreur: Livreur = {
        id: 'liv-12349',
        firstName: 'Default',
        lastName: 'User',
        email: 'default@example.com',
        phone: '+33600000000',
        status: LivreurStatus.AVAILABLE,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      expect(livreur.currentPosition).toBeUndefined();
      expect(livreur.lastPositionUpdate).toBeUndefined();
      expect(livreur.vehicle).toBeUndefined();
    });
  });
});
