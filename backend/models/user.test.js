"use strict"

const db = require("../db.js");
const { BadRequestError } = require("../expressError");
const User = require("./user.js");
const {
    commonBeforeAll,
    commonBeforeEach,
    commonAfterEach,
    commonAfterAll,
    testIds
} = require("./_testCommon");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

describe('User.registerUser()', () => {
    
    test('should throw BadRequestError if duplicate username.', async () => {
        const username = 'aBrant1';
        try {
            await User.registerUser({ username });
        } catch (error) {
            expect(error).toEqual(new BadRequestError(`Duplicate username: aBrant1`));
        }
    });

    test('should register a user and get new Id.', async () => {
        const fakeFormData = { 
            username: 'testUsername',
            fName: 'testFirst',
            lName: 'testLast',
            email: 'test@test.com',
            password: 'testMeOnce',
            category: 'test student',
            isAdmin: false
        };

        const registeredUserId = await User.registerUser(fakeFormData);
        expect(registeredUserId).toEqual(expect.any(Number));

        const newUser = await db.query(`
            SELECT
                username,
                first_name,
                category
            FROM users
            WHERE id = ${registeredUserId};`
        );
        expect(newUser.rows[0]).toEqual({ 
            username: fakeFormData.username, 
            first_name: fakeFormData.fName, 
            category: fakeFormData.category 
        });
    });
});
