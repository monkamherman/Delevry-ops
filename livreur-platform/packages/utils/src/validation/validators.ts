/**
 * Vérifie si une valeur est vide (null, undefined, chaîne vide, tableau vide, objet vide)
 * @param value - Valeur à vérifier
 * @returns true si la valeur est considérée comme vide
 */
export function isEmpty(value: any): boolean {
  if (value === null || value === undefined) {
    return true;
  }
  
  if (typeof value === 'string' || Array.isArray(value)) {
    return value.length === 0;
  }
  
  if (typeof value === 'object') {
    return Object.keys(value).length === 0;
  }
  
  return false;
}

/**
 * Vérifie si une valeur est une adresse email valide
 * @param email - Adresse email à valider
 * @returns true si l'email est valide
 */
export function isValidEmail(email: string): boolean {
  if (!email) return false;
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Vérifie si une valeur est un numéro de téléphone valide (format international simplifié)
 * @param phone - Numéro de téléphone à valider
 * @returns true si le numéro est valide
 */
export function isValidPhone(phone: string): boolean {
  if (!phone) return false;
  
  // Supprime les espaces, tirets et parenthèses
  const cleaned = phone.replace(/[\s\-()]/g, '');
  
  // Vérifie le format international (commence par + suivi de 10 à 15 chiffres)
  const phoneRegex = /^\+?[0-9]{10,15}$/;
  return phoneRegex.test(cleaned);
}

/**
 * Vérifie si une valeur est une URL valide
 * @param url - URL à valider
 * @param options - Options de validation
 * @returns true si l'URL est valide
 */
export function isValidUrl(
  url: string, 
  options: { 
    protocols?: string[];
    requireProtocol?: boolean;
    requireValidProtocol?: boolean;
  } = {}
): boolean {
  if (!url) return false;
  
  const {
    protocols = ['http', 'https', 'ftp'],
    requireProtocol = true,
    requireValidProtocol = true
  } = options;
  
  try {
    const urlObj = new URL(url);
    
    if (requireProtocol && !urlObj.protocol) {
      return false;
    }
    
    if (requireValidProtocol) {
      const protocol = urlObj.protocol.replace(':', '');
      if (!protocols.includes(protocol)) {
        return false;
      }
    }
    
    return true;
  } catch (e) {
    return false;
  }
}

/**
 * Vérifie si une valeur est une date valide
 * @param date - Date à valider (peut être une chaîne, un nombre ou un objet Date)
 * @returns true si la date est valide
 */
export function isValidDate(date: any): boolean {
  if (!date) return false;
  
  const d = new Date(date);
  return !isNaN(d.getTime());
}

/**
 * Vérifie si une valeur est un nombre
 * @param value - Valeur à vérifier
 * @returns true si la valeur est un nombre
 */
export function isNumeric(value: any): boolean {
  if (typeof value === 'number') return true;
  if (typeof value !== 'string') return false;
  
  return !isNaN(parseFloat(value)) && isFinite(Number(value));
}

/**
 * Vérifie si une valeur est un entier
 * @param value - Valeur à vérifier
 * @returns true si la valeur est un entier
 */
export function isInteger(value: any): boolean {
  if (typeof value === 'number') {
    return Number.isInteger(value);
  }
  
  if (typeof value === 'string') {
    return /^-?\d+$/.test(value);
  }
  
  return false;
}

/**
 * Vérifie si une valeur est comprise dans une plage
 * @param value - Valeur à vérifier
 * @param min - Valeur minimale (incluse)
 * @param max - Valeur maximale (incluse)
 * @returns true si la valeur est dans la plage
 */
export function isInRange(
  value: number | string, 
  min: number, 
  max: number
): boolean {
  const num = typeof value === 'string' ? parseFloat(value) : value;
  
  if (isNaN(num)) {
    return false;
  }
  
  return num >= min && num <= max;
}

/**
 * Vérifie si une chaîne a une longueur comprise dans une plage
 * @param value - Chaîne à vérifier
 * @param min - Longueur minimale (incluse)
 * @param max - Longueur maximale (incluse)
 * @returns true si la longueur est dans la plage
 */
export function isLengthInRange(
  value: string | any[], 
  min: number, 
  max: number = Number.MAX_SAFE_INTEGER
): boolean {
  if (!value) return false;
  
  const length = Array.isArray(value) ? value.length : value.toString().length;
  return length >= min && length <= max;
}

/**
 * Vérifie si une valeur correspond à une expression régulière
 * @param value - Valeur à vérifier
 * @param pattern - Expression régulière ou chaîne de motif
 * @returns true si la valeur correspond au motif
 */
export function matchesPattern(
  value: string, 
  pattern: string | RegExp
): boolean {
  if (!value) return false;
  
  const regex = typeof pattern === 'string' 
    ? new RegExp(pattern) 
    : pattern;
    
  return regex.test(value);
}

/**
 * Vérifie si une valeur est incluse dans une liste de valeurs autorisées
 * @param value - Valeur à vérifier
 * @param allowedValues - Tableau de valeurs autorisées
 * @returns true si la valeur est dans la liste des valeurs autorisées
 */
export function isOneOf<T>(
  value: T, 
  allowedValues: readonly T[]
): boolean {
  return allowedValues.includes(value);
}

/**
 * Valide un numéro de sécurité sociale français (format simplifié)
 * @param ssn - Numéro de sécurité sociale à valider
 * @returns true si le numéro est valide
 */
export function isValidFrenchSSN(ssn: string): boolean {
  if (!ssn) return false;
  
  // Supprime les espaces et tirets
  const cleaned = ssn.replace(/[\s-]/g, '');
  
  // Vérifie le format (15 chiffres)
  if (!/^\d{15}$/.test(cleaned)) {
    return false;
  }
  
  // Vérifie la clé de contrôle (2 derniers chiffres)
  const key = parseInt(cleaned.substring(13), 10);
  const number = parseInt(cleaned.substring(0, 13), 10);
  
  return (97 - (number % 97)) === key || (number % 97) === 0;
}

/**
 * Valide un code postal français (5 chiffres)
 * @param zipCode - Code postal à valider
 * @returns true si le code postal est valide
 */
export function isValidFrenchZipCode(zipCode: string): boolean {
  if (!zipCode) return false;
  
  // Supprime les espaces
  const cleaned = zipCode.replace(/\s/g, '');
  
  // Vérifie le format (5 chiffres)
  return /^\d{5}$/.test(cleaned);
}

/**
 * Valide un numéro de TVA intracommunautaire (format simplifié)
 * @param vat - Numéro de TVA à valider
 * @returns true si le numéro de TVA est valide
 */
export function isValidVATNumber(vat: string): boolean {
  if (!vat) return false;
  
  // Supprime les espaces, points et tirets
  const cleaned = vat.replace(/[\s.-]/g, '').toUpperCase();
  
  // Vérifie le format (2 lettres suivies de 9 à 12 chiffres)
  return /^[A-Z]{2}[0-9A-Z]{2,12}$/.test(cleaned);
}

/**
 * Valide un mot de passe selon des critères de complexité
 * @param password - Mot de passe à valider
 * @param options - Options de validation
 * @returns Un objet avec les détails de la validation
 */
export function validatePassword(
  password: string,
  options: {
    minLength?: number;
    requireUppercase?: boolean;
    requireLowercase?: boolean;
    requireNumbers?: boolean;
    requireSpecialChars?: boolean;
  } = {}
): {
  isValid: boolean;
  errors: string[];
  score: number; // 0-100
} {
  const {
    minLength = 8,
    requireUppercase = true,
    requireLowercase = true,
    requireNumbers = true,
    requireSpecialChars = true
  } = options;
  
  const errors: string[] = [];
  let score = 0;
  
  // Vérification de la longueur minimale
  if (password.length < minLength) {
    errors.push(`Le mot de passe doit contenir au moins ${minLength} caractères`);
  } else {
    score += 20;
  }
  
  // Vérification des majuscules
  if (requireUppercase && !/[A-Z]/.test(password)) {
    errors.push('Le mot de passe doit contenir au moins une majuscule');
  } else if (requireUppercase) {
    score += 20;
  }
  
  // Vérification des minuscules
  if (requireLowercase && !/[a-z]/.test(password)) {
    errors.push('Le mot de passe doit contenir au moins une minuscule');
  } else if (requireLowercase) {
    score += 20;
  }
  
  // Vérification des chiffres
  if (requireNumbers && !/\d/.test(password)) {
    errors.push('Le mot de passe doit contenir au moins un chiffre');
  } else if (requireNumbers) {
    score += 20;
  }
  
  // Vérification des caractères spéciaux
  if (requireSpecialChars && !/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>/?]/.test(password)) {
    errors.push('Le mot de passe doit contenir au moins un caractère spécial');
  } else if (requireSpecialChars) {
    score += 20;
  }
  
  // Calcul du score basé sur la complexité
  if (password.length >= 12) score = Math.min(100, score + 20);
  
  return {
    isValid: errors.length === 0,
    errors,
    score
  };
}
