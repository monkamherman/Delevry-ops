import { format as fnsFormat, formatDistanceToNow, parseISO, isValid as isDateValid } from 'date-fns';
import { fr } from 'date-fns/locale';

/**
 * Formate une date selon un format spécifique
 * @param date - Date à formater (Date, string ou timestamp)
 * @param format - Format de date (par défaut: 'dd/MM/yyyy HH:mm')
 * @returns La date formatée en chaîne de caractères
 */
export function formatDate(
  date: Date | string | number,
  format: string = 'dd/MM/yyyy HH:mm'
): string {
  const parsedDate = typeof date === 'string' ? parseISO(date) : new Date(date);
  
  if (!isDateValid(parsedDate)) {
    throw new Error('Date invalide');
  }
  
  return fnsFormat(parsedDate, format, { locale: fr });
}

/**
 * Calcule la différence de temps entre une date et maintenant en français
 * @param date - Date de référence (Date, string ou timestamp)
 * @returns Chaîne décrivant la différence (ex: "il y a 2 heures")
 */
export function timeAgo(date: Date | string | number): string {
  const parsedDate = typeof date === 'string' ? parseISO(date) : new Date(date);
  
  if (!isDateValid(parsedDate)) {
    throw new Error('Date invalide');
  }
  
  return formatDistanceToNow(parsedDate, { 
    addSuffix: true,
    locale: fr 
  });
}

/**
 * Formate une durée en millisecondes en une chaîne lisible
 * @param ms - Durée en millisecondes
 * @returns Chaîne formatée (ex: "2h 30min 15s")
 */
export function formatDuration(ms: number): string {
  if (ms < 0) return '0s';
  
  const seconds = Math.floor((ms / 1000) % 60);
  const minutes = Math.floor((ms / (1000 * 60)) % 60);
  const hours = Math.floor((ms / (1000 * 60 * 60)) % 24);
  const days = Math.floor(ms / (1000 * 60 * 60 * 24));
  
  const parts: string[] = [];
  
  if (days > 0) parts.push(`${days}j`);
  if (hours > 0) parts.push(`${hours}h`);
  if (minutes > 0) parts.push(`${minutes}min`);
  if (seconds > 0 || parts.length === 0) parts.push(`${seconds}s`);
  
  return parts.join(' ');
}

/**
 * Vérifie si une date est aujourd'hui
 * @param date - Date à vérifier
 * @returns true si la date est aujourd'hui
 */
export function isToday(date: Date | string | number): boolean {
  const today = new Date();
  const checkDate = typeof date === 'string' ? parseISO(date) : new Date(date);
  
  return (
    checkDate.getDate() === today.getDate() &&
    checkDate.getMonth() === today.getMonth() &&
    checkDate.getFullYear() === today.getFullYear()
  );
}

/**
 * Vérifie si une date est dans le futur
 * @param date - Date à vérifier
 * @returns true si la date est dans le futur
 */
export function isFutureDate(date: Date | string | number): boolean {
  const checkDate = typeof date === 'string' ? parseISO(date) : new Date(date);
  return checkDate > new Date();
}

/**
 * Vérifie si une date est dans le passé
 * @param date - Date à vérifier
 * @returns true si la date est dans le passé
 */
export function isPastDate(date: Date | string | number): boolean {
  const checkDate = typeof date === 'string' ? parseISO(date) : new Date(date);
  return checkDate < new Date();
}

/**
 * Calcule l'âge à partir d'une date de naissance
 * @param birthDate - Date de naissance
 * @returns Âge en années
 */
export function calculateAge(birthDate: Date | string | number): number {
  const birth = typeof birthDate === 'string' ? parseISO(birthDate) : new Date(birthDate);
  const today = new Date();
  
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  
  return age;
}
