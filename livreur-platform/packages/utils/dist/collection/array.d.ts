/**
 * Filtre un tableau en supprimant les valeurs null ou undefined
 * @param arr - Tableau à filtrer
 * @returns Nouveau tableau sans les valeurs null ou undefined
 */
export declare function compact<T>(arr: (T | null | undefined)[]): T[];
/**
 * Supprime les doublons d'un tableau basé sur une clé ou une fonction de comparaison
 * @param arr - Tableau à dédoublonner
 * @param keyOrFn - Clé de l'objet ou fonction de comparaison
 * @returns Nouveau tableau sans doublons
 */
export declare function uniqBy<T>(arr: T[], keyOrFn: string | ((item: T) => unknown)): T[];
/**
 * Groupe les éléments d'un tableau par une clé ou une fonction
 * @param arr - Tableau à grouper
 * @param keyOrFn - Clé de l'objet ou fonction de regroupement
 * @returns Objet avec les clés de groupe et les tableaux de valeurs correspondants
 */
export declare function groupBy<T>(arr: T[], keyOrFn: string | ((item: T) => string)): Record<string, T[]>;
/**
 * Trie un tableau d'objets par une ou plusieurs propriétés
 * @param arr - Tableau à trier
 * @param keys - Clé(s) de tri (préfixez par '-' pour un ordre décroissant)
 * @returns Nouveau tableau trié
 */
export declare function sortBy<T>(arr: T[], ...keys: string[]): T[];
/**
 * Récupère une valeur imbriquée dans un objet en utilisant une notation à points
 * @param obj - Objet source
 * @param path - Chemin vers la propriété (ex: 'user.address.city')
 * @param defaultValue - Valeur par défaut si la propriété n'existe pas
 * @returns La valeur trouvée ou la valeur par défaut
 */
export declare function getNestedValue<T = any>(obj: any, path: string, defaultValue?: T): T | undefined;
/**
 * Crée un objet à partir d'un tableau en utilisant une clé unique
 * @param arr - Tableau d'objets
 * @param key - Clé à utiliser comme clé de l'objet
 * @returns Objet avec les clés correspondant aux valeurs de la clé spécifiée
 */
export declare function keyBy<T>(arr: T[], key: string): Record<string, T>;
/**
 * Divise un tableau en plusieurs tableaux plus petits
 * @param arr - Tableau à diviser
 * @param size - Taille maximale de chaque sous-tableau
 * @returns Tableau de tableaux
 */
export declare function chunk<T>(arr: T[], size: number): T[][];
/**
 * Fusionne plusieurs tableaux en un seul, en supprimant les doublons
 * @param arrays - Tableaux à fusionner
 * @returns Tableau fusionné sans doublons
 */
export declare function mergeUnique<T>(...arrays: T[][]): T[];
/**
 * Trouve la différence entre deux tableaux
 * @param arr1 - Premier tableau
 * @param arr2 - Deuxième tableau
 * @returns Éléments qui sont dans arr1 mais pas dans arr2
 */
export declare function difference<T>(arr1: T[], arr2: T[]): T[];
/**
 * Trouve l'intersection de plusieurs tableaux
 * @param arrays - Tableaux à comparer
 * @returns Éléments communs à tous les tableaux
 */
export declare function intersection<T>(...arrays: T[][]): T[];
