import { z } from 'zod';
import { ResponseValidator } from '../src/validation/responseValidator';
import { errorResponseSchema } from '../src/validation/schemas';

describe('ResponseValidator', () => {
  let validator: ResponseValidator;
  
  const userSchema = z.object({
    id: z.string().uuid(),
    name: z.string(),
    email: z.string().email(),
    role: z.enum(['user', 'admin']),
    createdAt: z.string().datetime(),
  });
  
  const apiResponseSchema = z.object({
    success: z.boolean(),
    data: userSchema.optional(),
    error: z.object({
      code: z.string(),
      message: z.string(),
      details: z.record(z.any()).optional(),
    }).optional(),
  });

  beforeEach(() => {
    validator = new ResponseValidator();
  });

  describe('validate', () => {
    it('should validate data against schema', () => {
      const validData = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        name: 'John Doe',
        email: 'john@example.com',
        role: 'user',
        createdAt: '2023-01-01T00:00:00.000Z',
      };

      const result = validator.validate(validData, userSchema);
      expect(result).toEqual(validData);
    });

    it('should throw validation error for invalid data', () => {
      const invalidData = {
        id: 'invalid-uuid',
        name: 'John Doe',
        email: 'not-an-email',
        role: 'invalid-role',
        createdAt: 'invalid-date',
      };

      expect(() => {
        validator.validate(invalidData, userSchema);
      }).toThrow('Validation error');
    });

    it('should not throw when throwOnValidationError is false', () => {
      const invalidData = { email: 'not-an-email' };
      const customValidator = new ResponseValidator({ throwOnValidationError: false });
      
      // On s'attend à ce que la méthode ne lève pas d'erreur
      // même avec des données invalides quand throwOnValidationError est false
      expect(() => {
        customValidator.validate(invalidData, userSchema);
      }).not.toThrow();
      
      // Vérifier que les données ne sont pas modifiées
      const result = customValidator.validate(invalidData, userSchema);
      expect(result).toBe(invalidData);
    });
  });

  describe('validateApiResponse', () => {
    it('should validate successful API response', () => {
      const response = {
        success: true,
        data: {
          id: '123e4567-e89b-12d3-a456-426614174000',
          name: 'John Doe',
          email: 'john@example.com',
          role: 'user',
          createdAt: '2023-01-01T00:00:00.000Z',
        },
      };

      const result = validator.validateApiResponse(response, userSchema);
      expect(result).toEqual({
        success: true,
        data: response.data,
      });
    });

    it('should validate error API response', () => {
      const errorResponse = {
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Validation failed',
          details: {
            field: 'email',
          },
        },
      };

      const result = validator.validateApiResponse(errorResponse, userSchema);
      expect(result).toEqual({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Validation failed',
          details: {
            field: 'email',
          },
        },
      });
    });

    it('should handle invalid API response structure', () => {
      const invalidResponse = {
        success: true,
        data: {
          id: 'invalid-uuid',
        },
      };

      expect(() => {
        validator.validateApiResponse(invalidResponse, userSchema);
      }).toThrow('Validation error');
    });
  });

  describe('createValidationError', () => {
    it('should create a validation error with issues', () => {
      // Créer une vraie erreur Zod
      const schema = z.object({
        name: z.string(),
      });
      
      let validationError: z.ZodError;
      try {
        schema.parse({ name: 123 });
      } catch (error) {
        validationError = error as z.ZodError;
      }
      
      const error = (validator as any).createValidationError(
        validationError!,
        { name: 123 }
      );

      expect(error.name).toBe('ValidationError');
      expect(error.message).toBe('Validation error');
      
      // Vérifier que l'erreur contient les propriétés attendues
      expect(error).toHaveProperty('isValidationError', true);
      expect(Array.isArray(error.issues)).toBe(true);
      expect(error.issues.length).toBeGreaterThan(0);
      expect(error.issues[0]).toHaveProperty('path');
      expect(error.issues[0]).toHaveProperty('message');
      expect(error.issues[0]).toHaveProperty('code');
      expect(error.data).toEqual({ name: 123 });
    });
  });

  describe('withOptions', () => {
    it('should create a new validator with merged options', () => {
      const customValidator = validator.withOptions({
        strict: true,
        onValidationError: jest.fn(),
      });

      expect(customValidator).toBeInstanceOf(ResponseValidator);
      expect(customValidator).not.toBe(validator);
    });
  });
});
