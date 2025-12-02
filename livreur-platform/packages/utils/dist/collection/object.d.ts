/**
 * Effectue une copie profonde d'un objet ou d'un tableau
 * @param source - Objet ou tableau à copier
 * @returns Copie profonde de l'objet
 */
export declare function deepClone<T>(source: T): T;
/**
 * Fusionne deux objets en profondeur
 * @param target - Objet cible
 * @param source - Objet source à fusionner
 * @returns Objet fusionné
 */
export declare function deepMerge<T extends object, U extends object>(target: T, source: U): T & U;
/**
 * Supprime les propriétés avec des valeurs null ou undefined d'un objet
 * @param obj - Objet à nettoyer
 * @param options - Options de nettoyage
 * @returns Nouvel objet sans les propriétés null/undefined
 */
export declare function cleanObject<T extends object>(obj: T, options?: {
    removeEmptyStrings?: boolean;
    removeZeros?: boolean;
    removeFalse?: boolean;
}): Partial<T>;
/**
 * Vérifie si un objet est vide (n'a pas de propriétés propres énumérables)
 * @param obj - Objet à vérifier
 * @returns true si l'objet est vide
 */
export declare function isEmptyObject(obj: any): boolean;
/**
 * Récupère une valeur d'un objet en utilisant un chemin
 * @param obj - Objet source
 * @param path - Chemin vers la propriété (ex: 'user.address.city' ou ['user', 'address', 'city'])
 * @param defaultValue - Valeur par défaut si la propriété n'existe pas
 * @returns La valeur trouvée ou la valeur par défaut
 */
export declare function getValue<T = any>(obj: any, path: string | string[], defaultValue?: T): T | undefined;
/**
 * Définit une valeur dans un objet en utilisant un chemin
 * @param obj - Objet cible
 * @param path - Chemin vers la propriété (ex: 'user.address.city' ou ['user', 'address', 'city'])
 * @param value - Valeur à définir
 * @returns Nouvel objet avec la valeur définie
 */
export declare function setValue<T extends object, V>(obj: T, path: string | string[], value: V): T;
/**
 * Crée un nouvel objet avec uniquement les propriétés spécifiées
 * @param obj - Objet source
 * @param keys - Tableau de clés à inclure
 * @returns Nouvel objet avec uniquement les propriétés spécifiées
 */
export declare function pick<T extends object, K extends keyof T>(obj: T, keys: K[]): Pick<T, K>;
/**
 * Crée un nouvel objet sans les propriétés spécifiées
 * @param obj - Objet source
 * @param keys - Tableau de clés à exclure
 * @returns Nouvel objet sans les propriétés spécifiées
 */
export declare function omit<T extends object, K extends keyof T>(obj: T, keys: K[]): Omit<T, K>;
/**
 * Transforme les clés d'un objet selon une fonction de transformation
 * @param obj - Objet source
 * @param transformFn - Fonction de transformation des clés
 * @returns Nouvel objet avec les clés transformées
 */
export declare function transformKeys<T extends object>(obj: T, transformFn: (key: string) => string): Record<string, any>;
/**
 * Transforme les valeurs d'un objet selon une fonction de transformation
 * @param obj - Objet source
 * @param transformFn - Fonction de transformation des valeurs
 * @returns Nouvel objet avec les valeurs transformées
 */
export declare function transformValues<T extends object, U>(obj: T, transformFn: (value: any, key: string) => U): Record<string, U>;
