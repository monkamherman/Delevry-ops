import { z, ZodError, type ZodSchema, type ZodType, type ParseParams } from 'zod';
import type { ValidatedApiResponse, ErrorResponse } from './schemas';

/**
 * Options pour le validateur de réponses
 */
interface BaseResponseValidatorOptions {
  /**
   * Si vrai, lève une exception en cas d'erreur de validation
   * @default true
   */
  throwOnValidationError?: boolean;

  /**
   * Callback appelé en cas d'erreur de validation
   */
  onValidationError?: (error: ZodError, data: unknown) => void | Promise<void>;
}

// Type utilitaire pour les options de validation étendues
type ExtendedParseParams = Omit<ParseParams, 'path' | 'errorMap' | 'async'> & {
  path?: (string | number)[];
  errorMap?: z.ZodErrorMap;
  async?: boolean;
};

export interface ResponseValidatorOptions extends BaseResponseValidatorOptions {
  /**
   * Options de validation Zod supplémentaires
   */
  validationOptions?: ExtendedParseParams;
}

/**
 * Classe pour valider les réponses API avec des schémas Zod
 */
export class ResponseValidator {
  private options: {
    throwOnValidationError: boolean;
    onValidationError?: (error: ZodError, data: unknown) => void | Promise<void>;
    validationOptions?: ExtendedParseParams;
  };

  constructor(options: ResponseValidatorOptions = {}) {
    const { validationOptions, ...restOptions } = options;
    
    this.options = {
      throwOnValidationError: true,
      ...restOptions,
      validationOptions: validationOptions ? { ...validationOptions } : undefined,
    };
  }

  /**
   * Valide une réponse API par rapport à un schéma
   */
  public validate<T>(
    data: unknown,
    schema: ZodSchema<T>,
    options?: ResponseValidatorOptions
  ): T {
    const mergedOptions = { 
      ...this.options, 
      ...options,
      validationOptions: {
        ...this.options.validationOptions,
        ...(options?.validationOptions || {})
      }
    };
    
    try {
      return schema.parse(data, mergedOptions.validationOptions);
    } catch (error) {
      if (error instanceof ZodError) {
        if (mergedOptions.onValidationError) {
          mergedOptions.onValidationError(error, data);
        }
        
        if (mergedOptions.throwOnValidationError) {
          throw this.createValidationError(error, data);
        }
        
        // Si throwOnValidationError est false, on retourne les données non validées
        return data as T;
      }
      throw error;
    }
  }

  /**
   * Valide une réponse API avec gestion des erreurs
   */
  public validateApiResponse<T>(
    response: unknown,
    dataSchema: ZodSchema<T>,
    options?: ResponseValidatorOptions
  ): ValidatedApiResponse<T> {
    const apiResponseSchema = z.object({
      success: z.boolean(),
      data: dataSchema.optional(),
      error: z.any().optional(),
      meta: z.record(z.any()).optional(),
    });

    const result = this.validate(response, apiResponseSchema, options);

    if (!result.success && result.error) {
      const error = this.validate(result.error, z.object({
        code: z.string(),
        message: z.string(),
        details: z.record(z.any()).optional(),
        errors: z.record(z.array(z.string())).optional(),
        timestamp: z.string().datetime().optional(),
      }), options);

      return {
        success: false,
        error,
      };
    }

    return {
      success: true,
      data: result.data as T,
      meta: result.meta,
    };
  }

  /**
   * Crée une erreur de validation à partir d'une erreur Zod
   */
  private createValidationError(error: ZodError, data: unknown): Error {
    const issues = error.errors.map((issue) => {
      const baseIssue = {
        path: issue.path.join('.'),
        message: issue.message,
        code: issue.code,
      };

      // Ajout des propriétés conditionnelles si elles existent
      const issueWithExtras = { ...baseIssue } as any;
      
      if ('received' in issue) {
        issueWithExtras.received = (issue as any).received;
      }
      
      if ('expected' in issue) {
        issueWithExtras.expected = (issue as any).expected;
      }
      
      return issueWithExtras;
    });

    const validationError = new Error('Validation error');
    Object.defineProperty(validationError, 'name', { value: 'ValidationError' });
    Object.defineProperty(validationError, 'isValidationError', { value: true });
    Object.defineProperty(validationError, 'issues', { value: issues });
    Object.defineProperty(validationError, 'data', { value: data });

    return validationError;
  }

  /**
   * Crée un validateur avec des options prédéfinies
   */
  public withOptions(options: ResponseValidatorOptions): ResponseValidator {
    const mergedOptions: ResponseValidatorOptions = {
      throwOnValidationError: options.throwOnValidationError ?? this.options.throwOnValidationError,
      onValidationError: options.onValidationError ?? this.options.onValidationError,
    };

    // Fusion manuelle des options de validation pour éviter les problèmes de typage
    if (this.options.validationOptions || options.validationOptions) {
      const mergedValidationOptions: ExtendedParseParams = {};
      
      // Copie des options de validation existantes
      if (this.options.validationOptions) {
        Object.assign(mergedValidationOptions, this.options.validationOptions);
      }
      
      // Fusion avec les nouvelles options
      if (options.validationOptions) {
        Object.entries(options.validationOptions).forEach(([key, value]) => {
          if (value !== undefined) {
            (mergedValidationOptions as any)[key] = value;
          }
        });
      }
      
      if (Object.keys(mergedValidationOptions).length > 0) {
        mergedOptions.validationOptions = mergedValidationOptions;
      }
    }
    
    return new ResponseValidator(mergedOptions);
  }
}

/**
 * Instance par défaut du validateur
 */
export const responseValidator = new ResponseValidator();

/**
 * Fonction utilitaire pour créer un validateur de réponse API
 */
export function createApiResponseValidator<T extends ZodType>(
  schema: T,
  options?: ResponseValidatorOptions
) {
  const validator = new ResponseValidator(options);
  
  return (data: unknown): z.infer<T> => {
    return validator.validate(data, schema, options);
  };
}

/**
 * Type utilitaire pour extraire le type d'un schéma Zod
 */
export type InferSchemaType<T> = T extends ZodSchema<infer U> ? U : never;
