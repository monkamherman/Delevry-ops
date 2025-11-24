"use strict";
/// <reference types="jest" />
/// <reference types="node" />
Object.defineProperty(exports, "__esModule", { value: true });
const date_1 = require("../date");
describe('Date Utilities', () => {
    const now = new Date('2023-01-01T12:00:00Z');
    beforeAll(() => {
        // Mock de la date actuelle pour les tests
        jest.useFakeTimers().setSystemTime(now);
    });
    afterAll(() => {
        jest.useRealTimers();
    });
    describe('formatDate', () => {
        it('formate une date selon le format spécifié', () => {
            const date = new Date('2023-01-15T14:30:00Z');
            expect((0, date_1.formatDate)(date, 'dd/MM/yyyy')).toBe('15/01/2023');
            expect((0, date_1.formatDate)(date, 'HH:mm')).toBe('14:30');
        });
        it('accepte une chaîne de caractères comme entrée', () => {
            expect((0, date_1.formatDate)('2023-01-15T14:30:00Z', 'dd/MM/yyyy HH:mm')).toBe('15/01/2023 14:30');
        });
    });
    describe('formatDuration', () => {
        it('formate une durée en minutes en format lisible', () => {
            expect((0, date_1.formatDuration)(30)).toBe('30 min');
            expect((0, date_1.formatDuration)(60)).toBe('1h');
            expect((0, date_1.formatDuration)(90)).toBe('1h 30min');
            expect((0, date_1.formatDuration)(125)).toBe('2h 05min');
        });
        it('gère les durées négatives', () => {
            expect((0, date_1.formatDuration)(-10)).toBe('0 min');
        });
    });
    describe('formatRelativeDate', () => {
        it('affiche "Aujourd\'hui" pour la date actuelle', () => {
            expect((0, date_1.formatRelativeDate)(now)).toBe('Aujourd\'hui à 12:00');
        });
        it('affiche "Hier" pour la veille', () => {
            const yesterday = new Date(now);
            yesterday.setDate(now.getDate() - 1);
            expect((0, date_1.formatRelativeDate)(yesterday)).toBe('Hier à 12:00');
        });
        it('affiche la date relative pour les dates plus anciennes', () => {
            const oldDate = new Date('2022-12-20T12:00:00Z');
            expect((0, date_1.formatRelativeDate)(oldDate)).toMatch(/il y a \d+ jours/);
        });
    });
    describe('getTimeDifferenceInMinutes', () => {
        it('calcule la différence en minutes entre deux dates', () => {
            const start = new Date('2023-01-01T12:00:00Z');
            const end = new Date('2023-01-01T13:30:00Z');
            expect((0, date_1.getTimeDifferenceInMinutes)(start, end)).toBe(90);
        });
        it('utilise la date actuelle comme date de fin par défaut', () => {
            const tenMinutesAgo = new Date(now.getTime() - 10 * 60 * 1000);
            expect((0, date_1.getTimeDifferenceInMinutes)(tenMinutesAgo)).toBe(10);
        });
    });
    describe('formatTimeRange', () => {
        it('formate une plage horaire', () => {
            const start = new Date('2023-01-01T14:00:00Z');
            const end = new Date('2023-01-01T15:30:00Z');
            expect((0, date_1.formatTimeRange)(start, end)).toBe('14:00 - 15:30');
        });
    });
    describe('isFutureDate / isPastDate', () => {
        it('détecte correctement les dates futures et passées', () => {
            const future = new Date(now.getTime() + 10000);
            const past = new Date(now.getTime() - 10000);
            expect((0, date_1.isFutureDate)(future)).toBe(true);
            expect((0, date_1.isPastDate)(future)).toBe(false);
            expect((0, date_1.isFutureDate)(past)).toBe(false);
            expect((0, date_1.isPastDate)(past)).toBe(true);
        });
    });
});
