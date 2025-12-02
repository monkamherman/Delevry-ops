import { addBusinessDays, isBusinessDay, getBusinessHoursBetween } from '../../date/businessDays';
import { addDays, setHours, setMinutes } from 'date-fns';

describe('Date Utilities - Business Days', () => {
  const monday = new Date(2023, 5, 5); // 5 juin 2023 (lundi)
  const tuesday = addDays(monday, 1);
  const friday = addDays(monday, 4);
  const saturday = addDays(monday, 5);
  const sunday = addDays(monday, 6);
  const nextMonday = addDays(monday, 7);

  describe('isBusinessDay', () => {
    it('retourne true pour un jour de semaine', () => {
      expect(isBusinessDay(monday)).toBe(true);
      expect(isBusinessDay(tuesday)).toBe(true);
      expect(isBusinessDay(friday)).toBe(true);
    });

    it('retourne false pour un week-end', () => {
      expect(isBusinessDay(saturday)).toBe(false);
      expect(isBusinessDay(sunday)).toBe(false);
    });
  });

  describe('addBusinessDays', () => {
    it('ajoute des jours ouvrés en sautant les week-ends', () => {
      // Lundi + 1 jour = mardi
      expect(addBusinessDays(monday, 1)).toEqual(tuesday);
      
      // Vendredi + 1 jour = lundi suivant
      expect(addBusinessDays(friday, 1)).toEqual(nextMonday);
      
      // Lundi + 5 jours = lundi suivant + 4 jours = vendredi
      expect(addBusinessDays(monday, 5)).toEqual(addDays(nextMonday, 4));
    });

    it('gère correctement le jour de départ non ouvré', () => {
      // Samedi + 1 jour ouvré = lundi
      expect(addBusinessDays(saturday, 1)).toEqual(nextMonday);
    });
  });

  describe('getBusinessHoursBetween', () => {
    it('calcule les heures ouvrables entre deux dates le même jour', () => {
      const start = setHours(setMinutes(monday, 30), 9); // Lundi 9h30
      const end = setHours(setMinutes(monday, 30), 17);  // Lundi 17h30
      
      // 8h de travail (9h-12h et 14h-18h) avec 30min de décalage
      expect(getBusinessHoursBetween(start, end)).toBeCloseTo(7.5);
    });

    it('calcule les heures ouvrables sur plusieurs jours', () => {
      const monday9h = setHours(monday, 9);
      const tuesday17h = setHours(tuesday, 17);
      
      // Lundi: 7h (9h-12h et 14h-17h) + Mardi: 8h (9h-12h et 14h-18h)
      expect(getBusinessHoursBetween(monday9h, tuesday17h)).toBe(15);
    });

    it('retourne 0 si la date de fin est avant la date de début', () => {
      const start = setHours(monday, 10);
      const end = setHours(monday, 9);
      
      expect(getBusinessHoursBetween(start, end)).toBe(0);
    });

    it('gère correctement les week-ends et jours fériés', () => {
      // Vendredi 17h au lundi 9h
      const friday17h = setHours(friday, 17);
      const nextMonday9h = setHours(nextMonday, 9);
      
      // Seulement 1h (17h-18h le vendredi) car le week-end n'est pas compté
      expect(getBusinessHoursBetween(friday17h, nextMonday9h)).toBe(1);
    });
  });
});
