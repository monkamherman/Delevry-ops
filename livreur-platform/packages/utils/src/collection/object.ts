/**
 * Effectue une copie profonde d'un objet ou d'un tableau
 * @param source - Objet ou tableau à copier
 * @returns Copie profonde de l'objet
 */
export function deepClone<T>(source: T): T {
  if (source === null || typeof source !== 'object') {
    return source;
  }

  if (Array.isArray(source)) {
    return source.map(item => deepClone(item)) as any;
  }

  if (source instanceof Date) {
    return new Date(source.getTime()) as any;
  }

  if (source instanceof Map) {
    const result = new Map();
    source.forEach((value, key) => {
      result.set(key, deepClone(value));
    });
    return result as any;
  }

  if (source instanceof Set) {
    const result = new Set();
    source.forEach(value => {
      result.add(deepClone(value));
    });
    return result as any;
  }

  const result: any = {};
  for (const key in source) {
    if (Object.prototype.hasOwnProperty.call(source, key)) {
      result[key] = deepClone(source[key]);
    }
  }

  return result as T;
}

/**
 * Fusionne deux objets en profondeur
 * @param target - Objet cible
 * @param source - Objet source à fusionner
 * @returns Objet fusionné
 */
export function deepMerge<T extends object, U extends object>(target: T, source: U): T & U {
  const result = { ...deepClone(target) } as any;
  
  for (const key in source) {
    if (Object.prototype.hasOwnProperty.call(source, key)) {
      const targetValue = result[key];
      const sourceValue = source[key];
      
      if (Array.isArray(targetValue) && Array.isArray(sourceValue)) {
        result[key] = [...targetValue, ...sourceValue];
      } else if (
        targetValue && 
        sourceValue && 
        typeof targetValue === 'object' && 
        typeof sourceValue === 'object' &&
        !(targetValue instanceof Date) &&
        !(sourceValue instanceof Date)
      ) {
        result[key] = deepMerge(targetValue, sourceValue);
      } else {
        result[key] = sourceValue;
      }
    }
  }
  
  return result as T & U;
}

/**
 * Supprime les propriétés avec des valeurs null ou undefined d'un objet
 * @param obj - Objet à nettoyer
 * @param options - Options de nettoyage
 * @returns Nouvel objet sans les propriétés null/undefined
 */
export function cleanObject<T extends object>(
  obj: T,
  options: { 
    removeEmptyStrings?: boolean;
    removeZeros?: boolean;
    removeFalse?: boolean;
  } = {}
): Partial<T> {
  const {
    removeEmptyStrings = true,
    removeZeros = false,
    removeFalse = false
  } = options;
  
  return Object.entries(obj).reduce((acc, [key, value]) => {
    if (value === null || value === undefined) {
      return acc;
    }
    
    if (removeEmptyStrings && value === '') {
      return acc;
    }
    
    if (removeZeros && value === 0) {
      return acc;
    }
    
    if (removeFalse && value === false) {
      return acc;
    }
    
    if (typeof value === 'object' && !Array.isArray(value) && !(value instanceof Date)) {
      const cleaned = cleanObject(value, options);
      if (Object.keys(cleaned).length > 0) {
        (acc as any)[key] = cleaned;
      }
    } else {
      (acc as any)[key] = value;
    }
    
    return acc;
  }, {} as Partial<T>);
}

/**
 * Vérifie si un objet est vide (n'a pas de propriétés propres énumérables)
 * @param obj - Objet à vérifier
 * @returns true si l'objet est vide
 */
export function isEmptyObject(obj: any): boolean {
  if (obj === null || obj === undefined) return true;
  if (typeof obj !== 'object') return false;
  if (Object.getOwnPropertySymbols(obj).length > 0) return false;
  return Object.keys(obj).length === 0;
}

/**
 * Récupère une valeur d'un objet en utilisant un chemin
 * @param obj - Objet source
 * @param path - Chemin vers la propriété (ex: 'user.address.city' ou ['user', 'address', 'city'])
 * @param defaultValue - Valeur par défaut si la propriété n'existe pas
 * @returns La valeur trouvée ou la valeur par défaut
 */
export function getValue<T = any>(
  obj: any,
  path: string | string[],
  defaultValue?: T
): T | undefined {
  if (!obj || typeof obj !== 'object') return defaultValue;
  
  const keys = Array.isArray(path) ? path : path.split('.');
  let result = obj;
  
  for (const key of keys) {
    if (result === null || result === undefined) return defaultValue;
    result = result[key];
  }
  
  return result !== undefined ? result : defaultValue;
}

/**
 * Définit une valeur dans un objet en utilisant un chemin
 * @param obj - Objet cible
 * @param path - Chemin vers la propriété (ex: 'user.address.city' ou ['user', 'address', 'city'])
 * @param value - Valeur à définir
 * @returns Nouvel objet avec la valeur définie
 */
export function setValue<T extends object, V>(
  obj: T,
  path: string | string[],
  value: V
): T {
  if (!obj || typeof obj !== 'object') {
    throw new Error('La cible doit être un objet');
  }
  
  const keys = Array.isArray(path) ? [...path] : path.split('.');
  const result = deepClone(obj);
  
  let current: any = result;
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    
    if (i === keys.length - 1) {
      current[key] = value;
    } else {
      if (!current[key] || typeof current[key] !== 'object') {
        current[key] = {};
      }
      current = current[key];
    }
  }
  
  return result;
}

/**
 * Crée un nouvel objet avec uniquement les propriétés spécifiées
 * @param obj - Objet source
 * @param keys - Tableau de clés à inclure
 * @returns Nouvel objet avec uniquement les propriétés spécifiées
 */
export function pick<T extends object, K extends keyof T>(
  obj: T,
  keys: K[]
): Pick<T, K> {
  return keys.reduce((result, key) => {
    if (key in obj) {
      result[key] = obj[key];
    }
    return result;
  }, {} as Pick<T, K>);
}

/**
 * Crée un nouvel objet sans les propriétés spécifiées
 * @param obj - Objet source
 * @param keys - Tableau de clés à exclure
 * @returns Nouvel objet sans les propriétés spécifiées
 */
export function omit<T extends object, K extends keyof T>(
  obj: T,
  keys: K[]
): Omit<T, K> {
  const result = { ...obj };
  for (const key of keys) {
    delete result[key];
  }
  return result;
}

/**
 * Transforme les clés d'un objet selon une fonction de transformation
 * @param obj - Objet source
 * @param transformFn - Fonction de transformation des clés
 * @returns Nouvel objet avec les clés transformées
 */
export function transformKeys<T extends object>(
  obj: T,
  transformFn: (key: string) => string
): Record<string, any> {
  return Object.entries(obj).reduce((result, [key, value]) => {
    const newKey = transformFn(key);
    result[newKey] = value;
    return result;
  }, {} as Record<string, any>);
}

/**
 * Transforme les valeurs d'un objet selon une fonction de transformation
 * @param obj - Objet source
 * @param transformFn - Fonction de transformation des valeurs
 * @returns Nouvel objet avec les valeurs transformées
 */
export function transformValues<T extends object, U>(
  obj: T,
  transformFn: (value: any, key: string) => U
): Record<string, U> {
  return Object.entries(obj).reduce((result, [key, value]) => {
    result[key] = transformFn(value, key);
    return result;
  }, {} as Record<string, U>);
}
