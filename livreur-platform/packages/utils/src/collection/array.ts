/**
 * Filtre un tableau en supprimant les valeurs null ou undefined
 * @param arr - Tableau à filtrer
 * @returns Nouveau tableau sans les valeurs null ou undefined
 */
export function compact<T>(arr: (T | null | undefined)[]): T[] {
  return arr.filter((item): item is T => item !== null && item !== undefined);
}

/**
 * Supprime les doublons d'un tableau basé sur une clé ou une fonction de comparaison
 * @param arr - Tableau à dédoublonner
 * @param keyOrFn - Clé de l'objet ou fonction de comparaison
 * @returns Nouveau tableau sans doublons
 */
export function uniqBy<T>(
  arr: T[], 
  keyOrFn: string | ((item: T) => unknown)
): T[] {
  const seen = new Set();
  const keyFn = typeof keyOrFn === 'function' 
    ? keyOrFn 
    : (item: any) => item[keyOrFn];
  
  return arr.filter(item => {
    const key = keyFn(item);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

/**
 * Groupe les éléments d'un tableau par une clé ou une fonction
 * @param arr - Tableau à grouper
 * @param keyOrFn - Clé de l'objet ou fonction de regroupement
 * @returns Objet avec les clés de groupe et les tableaux de valeurs correspondants
 */
export function groupBy<T>(
  arr: T[], 
  keyOrFn: string | ((item: T) => string)
): Record<string, T[]> {
  const keyFn = typeof keyOrFn === 'function' 
    ? keyOrFn 
    : (item: any) => item[keyOrFn];
  
  return arr.reduce((acc, item) => {
    const key = keyFn(item);
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(item);
    return acc;
  }, {} as Record<string, T[]>);
}

/**
 * Trie un tableau d'objets par une ou plusieurs propriétés
 * @param arr - Tableau à trier
 * @param keys - Clé(s) de tri (préfixez par '-' pour un ordre décroissant)
 * @returns Nouveau tableau trié
 */
export function sortBy<T>(
  arr: T[], 
  ...keys: string[]
): T[] {
  return [...arr].sort((a, b) => {
    for (const key of keys) {
      let sortOrder = 1;
      let actualKey = key;
      
      if (key.startsWith('-')) {
        sortOrder = -1;
        actualKey = key.substring(1);
      }
      
      const aValue = getNestedValue(a, actualKey);
      const bValue = getNestedValue(b, actualKey);
      
      if (aValue < bValue) return -1 * sortOrder;
      if (aValue > bValue) return 1 * sortOrder;
    }
    return 0;
  });
}

/**
 * Récupère une valeur imbriquée dans un objet en utilisant une notation à points
 * @param obj - Objet source
 * @param path - Chemin vers la propriété (ex: 'user.address.city')
 * @param defaultValue - Valeur par défaut si la propriété n'existe pas
 * @returns La valeur trouvée ou la valeur par défaut
 */
export function getNestedValue<T = any>(
  obj: any,
  path: string,
  defaultValue?: T
): T | undefined {
  if (!obj || typeof obj !== 'object') return defaultValue;
  
  const keys = path.split('.');
  let result = obj;
  
  for (const key of keys) {
    result = result?.[key];
    if (result === undefined) return defaultValue;
  }
  
  return result !== undefined ? result : defaultValue;
}

/**
 * Crée un objet à partir d'un tableau en utilisant une clé unique
 * @param arr - Tableau d'objets
 * @param key - Clé à utiliser comme clé de l'objet
 * @returns Objet avec les clés correspondant aux valeurs de la clé spécifiée
 */
export function keyBy<T>(
  arr: T[], 
  key: string
): Record<string, T> {
  return arr.reduce((acc, item) => {
    const keyValue = getNestedValue(item, key);
    if (keyValue !== undefined) {
      acc[String(keyValue)] = item;
    }
    return acc;
  }, {} as Record<string, T>);
}

/**
 * Divise un tableau en plusieurs tableaux plus petits
 * @param arr - Tableau à diviser
 * @param size - Taille maximale de chaque sous-tableau
 * @returns Tableau de tableaux
 */
export function chunk<T>(arr: T[], size: number): T[][] {
  if (size <= 0) return [];
  
  const result: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    result.push(arr.slice(i, i + size));
  }
  return result;
}

/**
 * Fusionne plusieurs tableaux en un seul, en supprimant les doublons
 * @param arrays - Tableaux à fusionner
 * @returns Tableau fusionné sans doublons
 */
export function mergeUnique<T>(...arrays: T[][]): T[] {
  const merged = ([] as T[]).concat(...arrays);
  return [...new Set(merged)];
}

/**
 * Trouve la différence entre deux tableaux
 * @param arr1 - Premier tableau
 * @param arr2 - Deuxième tableau
 * @returns Éléments qui sont dans arr1 mais pas dans arr2
 */
export function difference<T>(arr1: T[], arr2: T[]): T[] {
  const set2 = new Set(arr2);
  return arr1.filter(x => !set2.has(x));
}

/**
 * Trouve l'intersection de plusieurs tableaux
 * @param arrays - Tableaux à comparer
 * @returns Éléments communs à tous les tableaux
 */
export function intersection<T>(...arrays: T[][]): T[] {
  if (arrays.length === 0) return [];
  if (arrays.length === 1) return [...new Set(arrays[0])];
  
  const sets = arrays.map(arr => new Set(arr));
  const firstSet = sets[0];
  
  return Array.from(firstSet).filter(item => 
    sets.slice(1).every(set => set.has(item))
  );
}
