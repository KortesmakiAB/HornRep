'use strict'

const db = require('../db');
const { BadRequestError, NotFoundError, UnauthorizedError } = require('../expressError');
const User = require('./user');
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

const me = {
    'username': 'aBrant1',
    'fName': 'Aaron',
    'lName': 'Brant',
    'email': 'aaron@awesomeSite.com',
    'password': '$2b$12$AZH7virni5jlTTiGgEg4zu3lSvAw68qVEfSIOjJ3RqtbJbdW/Oi5q',
    'category': 'academia',
    'isAdmin': true
};

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
        // isAdmin default is false. User cannot register self as an admin.
        
        const fakeFormData = { 
            username: 'testUsername',
            fName: 'testFirst',
            lName: 'testLast',
            email: 'test@test.com',
            password: 'testMeOnce',
            category: 'test student',
        };

        const registeredUserId = await User.registerUser(fakeFormData);
        expect(registeredUserId).toEqual(expect.any(Number));

        const verifyNewUser = await db.query(`
            SELECT
                username,
                first_name,
                category,
                is_admin AS "isAdmin"
            FROM users
            WHERE id = ${registeredUserId};`
        );
        expect(verifyNewUser.rows[0]).toEqual({ 
            username: fakeFormData.username, 
            first_name: fakeFormData.fName, 
            category: fakeFormData.category ,
            isAdmin: false
        });
    });
});

describe('User.getUser(id)', () => {
    test('should throw error if user not found - get.', async () => {
        try {
            await User.getUser(0);
        } catch (error) {
            expect(error).toEqual(new NotFoundError('User with id - 0 not found.'));
        }
    });

    test('should get user details', async () => {
        const meResp = await User.getUser(testIds.users[1]);
        expect(meResp).toEqual({ ...me, 'id': testIds.users[1] });
    });
    
});

describe('User.updateUser(id, formFields)', () => {
    test('should throw error if user not found - update.', async () => {
        try {
            await User.updateUser(0, {});
        } catch (error) {
            expect(error).toEqual(new NotFoundError('User with id - 0 not found.'));
        } 
    });
    
    test('should update any or all fields (except isAdmin).', async () => {
        me.fName = 'Darth';
        me.lName = 'Vader';
        delete me. isAdmin;

        const emperorId = await User.updateUser(testIds.users[1], me);

        const emperor = await db.query(`
            SELECT
                username,
                first_name AS "fName",
                last_name AS "lName",
                email,
                password,
                category,
                is_admin AS "isAdmin"
            FROM users
            WHERE id = $1;`,
            [emperorId]
        );

        expect(emperor.rows[0]).toEqual({
            'username': 'aBrant1',
            'fName': 'Darth',
            'lName': 'Vader',
            'email': 'aaron@awesomeSite.com',
            'password': '$2b$12$AZH7virni5jlTTiGgEg4zu3lSvAw68qVEfSIOjJ3RqtbJbdW/Oi5q',
            'category': 'academia',
            'isAdmin': true
        });
    });

    test('should not update isAdmin.', async () => {
        me.isAdmin = false;
        const failedAttemptId = await User.updateUser(testIds.users[1], me);

        const stillAdmin = await db.query(`
            SELECT username, is_admin AS "isAdmin"
            FROM users
            WHERE id = ${failedAttemptId};`
        );

        expect(stillAdmin.rows[0]).toEqual({
            username: 'aBrant1',
            isAdmin: true
        });
    });

    test('should throw error if duplicate username.', async () => {
        try {
            me.username = 'sSchouten1';
            delete me. isAdmin;
            
            await User.updateUser(testIds.users[1], me);
        } catch (error) {
            expect(error).toEqual(new Error('duplicate key value violates unique constraint "users_username_key"'));
        } 
    });

    test('should throw error if duplicate email.', async () => {
        try {
            me.email = 'sarah@awesomeSite.com';
            delete me. isAdmin;
            
            await User.updateUser(testIds.users[1], me);
        } catch (error) {
            expect(error).toEqual(new Error('duplicate key value violates unique constraint "users_username_key"'));
        } 
    });
});
    
describe('User.deleteUser()', () => {
    test("should delete me. It will be sad.", async () => {
        const deleteResp = await User.deleteUser(testIds.users[1]);
        expect(deleteResp).toBe(undefined);

        const oneUserLeft = await db.query(`SELECT * FROM users;`);
        expect(oneUserLeft.rows.length).toBe(1);
        expect(oneUserLeft.rows[0].first_name).toBe('Sarah');
        expect(oneUserLeft.rows[1]).toBe(undefined);
    });

    test('should throw error if User not found - deleteUser()', async () => {
        try {
            await User.deleteUser(0);
        } catch (error) {
            expect(error).toEqual(new NotFoundError(`User with id - 0 not found.`));
        }
    });
});

// inherited these tests from Rithm school. 

describe("User.authenticate()", function () {
    test("works", async function () {
      const user = await User.authenticate("aBrant1", "password");
      expect(user).toEqual({
        id: testIds.users[1],
        username: "aBrant1",
        fName: "Aaron",
        lName: "Brant",
        email: "aaron@awesomeSite.com",
        category: "academia",
        isAdmin: true
      });
    });
  
    test("unauth if no such user", async function () {
      try {
        await User.authenticate("nope", "password");
        fail();
      } catch (err) {
        expect(err instanceof UnauthorizedError).toBeTruthy();
      }
    });
  
    test("unauth if wrong password", async function () {
      try {
        await User.authenticate("aBrant1", "wrong");
        fail();
      } catch (err) {
        expect(err instanceof UnauthorizedError).toBeTruthy();
      }
    });
});


