"use strict";
/// <reference types="jest" />
/// <reference types="node" />
Object.defineProperty(exports, "__esModule", { value: true });
const validation_1 = require("../validation");
describe('Validation', () => {
    describe('validatePosition', () => {
        it('valide une position correcte', () => {
            const result = (0, validation_1.validatePosition)({ lat: 48.8566, lng: 2.3522 });
            expect(result.valid).toBe(true);
        });
        it('invalide une position avec latitude incorrecte', () => {
            const result = (0, validation_1.validatePosition)({ lat: 100, lng: 0 });
            expect(result.valid).toBe(false);
            expect(result.errors).toContain('La latitude doit être comprise entre -90 et 90 degrés');
        });
    });
    describe('isValidEmail', () => {
        it('valide des emails valides', () => {
            expect((0, validation_1.isValidEmail)('test@example.com')).toBe(true);
            expect((0, validation_1.isValidEmail)('user.name+tag@example.co.uk')).toBe(true);
        });
        it('invalide des emails invalides', () => {
            expect((0, validation_1.isValidEmail)('plainaddress')).toBe(false);
            expect((0, validation_1.isValidEmail)('@missingusername.com')).toBe(false);
            expect((0, validation_1.isValidEmail)('user@.com')).toBe(false);
        });
    });
    describe('isValidFrenchPhoneNumber', () => {
        it('valide des numéros de téléphone français valides', () => {
            expect((0, validation_1.isValidFrenchPhoneNumber)('0612345678')).toBe(true);
            expect((0, validation_1.isValidFrenchPhoneNumber)('06 12 34 56 78')).toBe(true);
            expect((0, validation_1.isValidFrenchPhoneNumber)('06-12-34-56-78')).toBe(true);
            expect((0, validation_1.isValidFrenchPhoneNumber)('+33612345678')).toBe(true);
        });
        it('invalide des numéros invalides', () => {
            expect((0, validation_1.isValidFrenchPhoneNumber)('0123456789')).toBe(false); // Ne commence pas par 06/07
            expect((0, validation_1.isValidFrenchPhoneNumber)('061234567')).toBe(false); // Trop court
            expect((0, validation_1.isValidFrenchPhoneNumber)('06123456789')).toBe(false); // Trop long
        });
    });
    describe('isValidFrenchZipCode', () => {
        it('valide des codes postaux français valides', () => {
            expect((0, validation_1.isValidFrenchZipCode)('75001')).toBe(true);
            expect((0, validation_1.isValidFrenchZipCode)('20190')).toBe(true);
            expect((0, validation_1.isValidFrenchZipCode)('98000')).toBe(true);
        });
        it('invalide des codes postaux invalides', () => {
            expect((0, validation_1.isValidFrenchZipCode)('1234')).toBe(false); // Trop court
            expect((0, validation_1.isValidFrenchZipCode)('123456')).toBe(false); // Trop long
            expect((0, validation_1.isValidFrenchZipCode)('ABCDE')).toBe(false); // Pas de chiffres
        });
    });
    describe('validatePassword', () => {
        it('valide un mot de passe fort', () => {
            const result = (0, validation_1.validatePassword)('P@ssw0rd');
            expect(result.valid).toBe(true);
            expect(result.requirements.length).toBe(0);
        });
        it('identifie les mots de passe faibles', () => {
            const weakPasswords = [
                { pwd: 'short', req: 4 },
                { pwd: 'nouppercase1!', req: 1 },
                { pwd: 'NOLOWERCASE1!', req: 1 },
                { pwd: 'NoNumbers!', req: 1 },
                { pwd: 'NoSpecial1', req: 1 },
            ];
            weakPasswords.forEach(({ pwd, req }) => {
                const result = (0, validation_1.validatePassword)(pwd);
                expect(result.valid).toBe(false);
                expect(result.requirements.length).toBe(req);
            });
        });
    });
    describe('isValidSIRET', () => {
        it('valide des SIRET valides', () => {
            // SIRET de test valide (selon l'algorithme de Luhn)
            expect((0, validation_1.isValidSIRET)('73282932000074')).toBe(true);
            expect((0, validation_1.isValidSIRET)('732-829-320-00074')).toBe(true);
            expect((0, validation_1.isValidSIRET)('732 829 320 00074')).toBe(true);
        });
        it('invalide des SIRET invalides', () => {
            expect((0, validation_1.isValidSIRET)('12345678901234')).toBe(false); // Invalide selon Luhn
            expect((0, validation_1.isValidSIRET)('12345')).toBe(false); // Trop court
            expect((0, validation_1.isValidSIRET)('7328293200007X')).toBe(false); // Caractères non numériques
        });
    });
});
