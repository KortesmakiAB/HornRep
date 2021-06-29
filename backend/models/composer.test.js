'use strict';

const db = require('../db');
const { NotFoundError } = require('../expressError');
const Composer = require('./composer');
const {
    commonBeforeAll,
    commonBeforeEach,
    commonAfterEach,
    commonAfterAll,
    testIds
} = require('./_testCommon');

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);


describe('Composer.addComposer()', () => {
    test('should return: id, fName, lName, country, gender', async () => {
        const compData = {
            fName: 'Wolfgang',
            lName: 'Testart',
            country: 'Testlandia',
            gender: 'Male'
        };
        const newComposer = await Composer.addComposer(compData) ;

        expect(newComposer).toEqual({
            id: expect.any(Number),
            ...compData
        });
    });
});

describe('Composer.getComposer()', () => {
    test('should get: id, fName, lName, country, gender', async () => {
        const composer = await Composer.getComposer(testIds.composers[1]);

        expect(composer).toEqual({
            id: testIds.composers[1],
            fName: 'Vincent',
            lName: 'Persichetti',
            country: 'United States',
            gender: 'male'
        });
    });

    test('should throw error if composer not found - get.', async () => {
        try {
            await Composer.getComposer(0);
        } catch (error) {
            expect(error).toEqual(new NotFoundError('Composer with id - 0 not found.'));
        }
    });
});

describe('Composer.allComposers()', () => {
    test('should get list of composers: id, fName, lName, country, gender', async () => {
        const composerList = await Composer.allComposers();
        expect(composerList.length).toBe(2);
        expect(composerList[0].lName).toBe('Strauss');
        expect(composerList[1].lName).toBe('Persichetti');
    });
});

describe('Composer.updateComposer()', () => {
    test('should update any/all fields and return id, fName, lName, country, gender ', async () => {
        const witnessProtection = {
            fName: 'Vincenzo',
            lName: 'Persnickety',
            country: 'Dubai',
            gender: 'male'
        };

        const updatedVince = await Composer.updateComposer(testIds.composers[1], witnessProtection);

        expect(updatedVince).toEqual({
            id: testIds.composers[1],
            ...witnessProtection
        });
    });
    
    test('should throw error is composer not found - update.', async () => {
        try {
            await Composer.updateComposer(0, {});
        } catch (error) {
            expect(error).toEqual(new NotFoundError('Composer with id - 0 not found.'));
        }
    });
});

describe('Composer.deleteComposer()', () => {
    test("should delete poor Vince. It will be sad.", async () => {
        const deleteResp = await Composer.deleteComposer(testIds.composers[1]);
        expect(deleteResp).toBe(undefined);

        const oneComposerLeft = await db.query(`SELECT * FROM composers;`);
        expect(oneComposerLeft.rows.length).toBe(1);
        expect(oneComposerLeft.rows[0].first_name).toBe('Richard');
        expect(oneComposerLeft.rows[1]).toBe(undefined);
    });

    test('should throw error if Composer not found - deleteComposer()', async () => {
        try {
            await Composer.deleteComposer(0);
        } catch (error) {
            expect(error).toEqual(new NotFoundError(`Composer with id - 0 not found.`));
        }
    });
});