import { format, formatDistanceToNow, isToday, isYesterday, parseISO, differenceInMinutes } from 'date-fns';
import { fr } from 'date-fns/locale';

/**
 * Formate une date en chaîne de caractères lisible
 * @param date Date à formater (Date, chaîne ou timestamp)
 * @param formatString Format de sortie (par défaut: 'dd/MM/yyyy HH:mm')
 * @returns Date formatée
 */
export function formatDate(
  date: Date | string | number,
  formatString: string = 'dd/MM/yyyy HH:mm'
): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : new Date(date);
  return format(dateObj, formatString, { locale: fr });
}

/**
 * Formate une durée en minutes en une chaîne lisible (ex: "2h 30min")
 * @param minutes Durée en minutes
 * @returns Durée formatée
 */
export function formatDuration(minutes: number): string {
  if (minutes < 0) return '0 min';
  
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = Math.round(minutes % 60);
  
  if (hours === 0) return `${remainingMinutes} min`;
  if (remainingMinutes === 0) return `${hours}h`;
  
  return `${hours}h ${remainingMinutes.toString().padStart(2, '0')}min`;
}

/**
 * Formate une date en une chaîne relative (ex: "il y a 5 minutes", "hier", etc.)
 * @param date Date à formater
 * @returns Date relative formatée
 */
export function formatRelativeDate(date: Date | string | number): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : new Date(date);
  
  if (isToday(dateObj)) {
    return `Aujourd'hui à ${format(dateObj, 'HH:mm')}`;
  }
  
  if (isYesterday(dateObj)) {
    return `Hier à ${format(dateObj, 'HH:mm')}`;
  }
  
  return formatDistanceToNow(dateObj, { 
    addSuffix: true, 
    locale: fr 
  });
}

/**
 * Calcule la différence entre deux dates en minutes
 * @param startDate Date de début
 * @param endDate Date de fin (par défaut: maintenant)
 * @returns Différence en minutes
 */
export function getTimeDifferenceInMinutes(
  startDate: Date | string | number,
  endDate: Date | string | number = new Date()
): number {
  const start = typeof startDate === 'string' ? parseISO(startDate) : new Date(startDate);
  const end = typeof endDate === 'string' ? parseISO(endDate) : new Date(endDate);
  
  return differenceInMinutes(end, start);
}

/**
 * Formate une plage horaire
 * @param startDate Date de début
 * @param endDate Date de fin
 * @returns Plage horaire formatée (ex: "14:00 - 15:30")
 */
export function formatTimeRange(
  startDate: Date | string | number,
  endDate: Date | string | number
): string {
  const start = typeof startDate === 'string' ? parseISO(startDate) : new Date(startDate);
  const end = typeof endDate === 'string' ? parseISO(endDate) : new Date(endDate);
  
  const startTime = format(start, 'HH:mm');
  const endTime = format(end, 'HH:mm');
  
  return `${startTime} - ${endTime}`;
}

/**
 * Vérifie si une date est dans le futur
 * @param date Date à vérifier
 * @returns true si la date est dans le futur, false sinon
 */
export function isFutureDate(date: Date | string | number): boolean {
  const dateObj = typeof date === 'string' ? parseISO(date) : new Date(date);
  return dateObj > new Date();
}

/**
 * Vérifie si une date est dans le passé
 * @param date Date à vérifier
 * @returns true si la date est dans le passé, false sinon
 */
export function isPastDate(date: Date | string | number): boolean {
  const dateObj = typeof date === 'string' ? parseISO(date) : new Date(date);
  return dateObj < new Date();
}
