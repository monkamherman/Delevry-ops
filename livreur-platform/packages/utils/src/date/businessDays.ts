import { isSameDay, setHours, setMinutes, startOfDay, addDays, isWeekend } from 'date-fns';

// Jours fériés en France (à compléter selon les besoins)
const HOLIDAYS: Date[] = [
  // Exemple : 1er janvier 2023
  new Date(2025, 0, 1),
];

/**
 * Vérifie si une date est un jour férié
 * @param date Date à vérifier
 * @returns true si la date est un jour férié
 */
function isHoliday(date: Date): boolean {
  return HOLIDAYS.some((holiday) => isSameDay(holiday, date));
}

/**
 * Vérifie si une date est un jour ouvré (du lundi au vendredi, non férié)
 * @param date Date à vérifier
 * @returns true si c'est un jour ouvré
 */
export function isBusinessDay(date: Date): boolean {
  return !isWeekend(date) && !isHoliday(date);
}

/**
 * Ajoute un nombre de jours ouvrés à une date
 * @param startDate Date de départ
 * @param days Nombre de jours ouvrés à ajouter
 * @returns Nouvelle date après ajout des jours ouvrés
 */
export function addBusinessDays(startDate: Date, days: number): Date {
  if (days < 0) {
    throw new Error("Le nombre de jours doit être positif");
  }

  // Créer une copie pour éviter de modifier la date d'origine
  let current = new Date(startDate);
  
  // Si le jour de départ est un jour non ouvré, on avance au prochain jour ouvré
  if (!isBusinessDay(current)) {
    current = addDays(current, 1);
    while (!isBusinessDay(current)) {
      current = addDays(current, 1);
    }
  }
  
  // Si on ne doit pas ajouter de jours, on retourne la date actuelle
  if (days === 0) {
    return current;
  }
  
  // Ajouter les jours ouvrés demandés
  let daysAdded = 0;
  while (daysAdded < days) {
    current = addDays(current, 1);
    if (isBusinessDay(current)) {
      daysAdded++;
    }
  }
  
  return current;
}

/**
 * Calcule le nombre d'heures ouvrables entre deux dates (9h-12h et 14h-18h)
 * @param startDate Date de début
 * @param endDate Date de fin
 * @returns Nombre d'heures ouvrables entre les deux dates
 */
export function getBusinessHoursBetween(startDate: Date, endDate: Date): number {
  if (endDate <= startDate) {
    return 0;
  }

  // Si c'est le même jour
  if (isSameDay(startDate, endDate)) {
    if (!isBusinessDay(startDate)) {
      return 0;
    }

    const startHour = startDate.getHours() + startDate.getMinutes() / 60;
    const endHour = endDate.getHours() + endDate.getMinutes() / 60;
    
    // Heures de travail : 9h-12h et 14h-18h
    const morningStart = 9;
    const morningEnd = 12;
    const afternoonStart = 14;
    const afternoonEnd = 18;
    
    // Si en dehors des heures de travail
    if (endHour <= morningStart || startHour >= afternoonEnd) {
      return 0;
    }
    
    // Calcul des heures du matin (9h-12h = 3h max)
    let morningHours = 0;
    if (endHour > morningStart && startHour < morningEnd) {
      const morningStartAdjusted = Math.max(startHour, morningStart);
      const morningEndAdjusted = Math.min(endHour, morningEnd);
      morningHours = Math.max(0, morningEndAdjusted - morningStartAdjusted);
    }
    
    // Calcul des heures de l'après-midi (14h-18h = 4h max)
    let afternoonHours = 0;
    if (endHour > afternoonStart && startHour < afternoonEnd) {
      const afternoonStartAdjusted = Math.max(startHour, afternoonStart);
      const afternoonEndAdjusted = Math.min(endHour, afternoonEnd);
      afternoonHours = Math.max(0, afternoonEndAdjusted - afternoonStartAdjusted);
    }
    
    return morningHours + afternoonHours;
  }

  // Pour les plages sur plusieurs jours
  let currentDate = new Date(startDate);
  currentDate.setHours(0, 0, 0, 0); // Réinitialiser à minuit
  
  const endDateDay = new Date(endDate);
  endDateDay.setHours(0, 0, 0, 0);
  
  let totalHours = 0;

  // Traitement du premier jour
  if (isBusinessDay(currentDate)) {
    const endOfDay = new Date(currentDate);
    endOfDay.setHours(18, 0, 0, 0); // Fin de journée à 18h
    
    // Si la date de fin est le même jour, utiliser endDate
    const endTime = isSameDay(currentDate, endDate) ? endDate : endOfDay;
    totalHours += getBusinessHoursBetween(startDate, endTime);
  }
  
  // Passer au jour suivant
  currentDate = addDays(currentDate, 1);
  currentDate.setHours(0, 0, 0, 0);
  
  // Jours complets entre les deux dates
  while (currentDate < endDateDay) {
    if (isBusinessDay(currentDate)) {
      // 3h le matin (9h-12h) + 4h l'après-midi (14h-18h) = 7h par jour
      totalHours += 7;
    }
    currentDate = addDays(currentDate, 1);
  }
  
  // Dernier jour
  if (isBusinessDay(currentDate) && isSameDay(currentDate, endDateDay)) {
    const startOfDayTime = new Date(currentDate);
    startOfDayTime.setHours(9, 0, 0, 0); // Début de journée à 9h
    
    // Si la date de fin est le même jour, utiliser endDate
    const endTime = isSameDayLocal(currentDate, endDate) ? endDate : new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(), 18, 0, 0);
    totalHours += getBusinessHoursBetween(startOfDayTime, endTime);
  }
  
  return totalHours;
}
/**
 * Fonction utilitaire pour vérifier si deux dates sont le même jour
 * @param date1 Première date à comparer
 * @param date2 Deuxième date à comparer
 * @returns true si les deux dates sont le même jour
 */
function isSameDayLocal(date1: Date, date2: Date): boolean {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
}
