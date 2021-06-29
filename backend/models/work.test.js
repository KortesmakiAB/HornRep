"use strict";

const db = require("../db");
const { NotFoundError, BadRequestError } = require("../expressError");
const Work = require("./work");
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

const today = new Date();

describe ('Work.getWork()', () => {
    test('should get 1 work', async () => {
        const worksResp = await Work.getWork(testIds.works[0]);
        
        expect(worksResp).toEqual({
            "accompDifficulty": "medium",
            "accompType": "orchestra, piano",
            "clef": "treble",
            "compYr": "1854",
            "lName": "Strauss",
            "fName": "Richard",
            "gender": "male",
            "country": "Germany",
            "difficulty": "medium/difficult",
            "duration": "15:30",
            "eraStyle": "romantic",
            "highestNote": 4,
            "id": testIds.works[0],
            "lowestNote": 6,
            "techniques": null,
            "title": "Concerto #1",
            "username": "sSchouten1",
            "comments": [
                {
                  "comment": "this is a monumental work for horn. genius",
                   "comment_date": `${today.toLocaleDateString('en-US', {year: 'numeric', month: '2-digit', day: '2-digit'})}`,
                   "username": "sSchouten1",
                },
                {
                   "comment": "this is a terrible work for horn. atrocious",
                   "comment_date": `${today.toLocaleDateString('en-US', {year: 'numeric', month: '2-digit', day: '2-digit'})}`,
                   "username": "sSchouten1",
                },
            ],
            "movements": [
                {
                    "difficulty": "Difficult",
                    "duration": "05:22",
                    "highestnote": 1,
                    "lowestnote": 8,
                    "title": "I. Allegro",
                },
                {
                    "difficulty": "Difficult",
                    "duration": "05:02",
                    "highestnote": 1,
                    "lowestnote": 8,
                    "title": "II. Andante",
                },
                {
                    "difficulty": "Intermediate-Advanced",
                    "duration": "05:20",
                    "highestnote": 1,
                    "lowestnote": 8,
                    "title": "III. Allegro",
                },
            ]
        });
    });

    test('should throw error if work not found - getWork().', async () => {
        try {
            await Work.getWork(0);
        } catch (error) {
            expect(error).toEqual(new NotFoundError(`Work with id - 0 not found.`));
        }
    });
});

describe('Work.search()', () => {
    test('should return [] if no results found', async () => {
        const noLadies = await Work.search({gender: 'female'});
        expect(noLadies).toEqual([]);
    });

    test('if no search params included, should return all works, sorted by last name, first name, title', async () => {
        const allWorks = await Work.search();

        expect(allWorks.length).toBe(2);
        
        // alphabetically, Persichetti comes before Strauss
        // so Persichetti should be idx 0 and Strauss should be idx 1
        expect(allWorks[0].lName).toBe('Persichetti');
        expect(allWorks[1]).toEqual({
            "accompDifficulty": "medium",
            "accompType": "orchestra, piano",
            "clef": "treble",
            "compYr": "1854",
            "lName": "Strauss",
            "fName": "Richard",
            "gender": "male",
            "country": "Germany",
            "difficulty": "medium/difficult",
            "duration": "15:30",
            "eraStyle": "romantic",
            "highestNote": 4,
            "id": testIds.works[0],
            "lowestNote": 6,
            "techniques": null,
            "title": "Concerto #1",
            "username": "sSchouten1",
        });
    });

    test('should simple search', async () => {
        const titleSearch = await Work.search({title:"concerto"});
        expect(titleSearch.length).toBe(1);
        expect(titleSearch[0].title).toBe("Concerto #1");
        
        // Strauss difficulty => "medium/difficult"
        const difficultySearch = await Work.search({difficulty:"medium"});
        expect(difficultySearch.length).toBe(1);
        expect(difficultySearch[0].title).toBe("Concerto #1");

        const genderSearch = await Work.search({gender: 'male'});
        expect(genderSearch.length).toBe(2);
    });

    test('should handle array search filters', async () => {
        // Persichetti techniques => 'flutter tongue, double-tongue'
        const partialMatches = await Work.search({techniques: ['flutter', 'double']});
        expect(partialMatches.length).toBe(1);
        expect(partialMatches[0].title).toBe('Parable for solo horn');
        expect(partialMatches[0].lName).toBe('Persichetti');

        // Strauss accompType => 'orchestra, piano'
        const exactMatches = await Work.search({accompType: ['orchestra', 'piano']});
        expect(exactMatches.length).toBe(1);
        expect(exactMatches[0].title).toBe('Concerto #1');
        expect(exactMatches[0].lName).toBe('Strauss');
    });

    test('should select works according to range', async () => {
        // 4 represents a high Bb. This excludes the Persichetti which has a high B (5)
        const highestNote = await Work.search({highestNote: 4});
        expect(highestNote.length).toBe(1);
        expect(highestNote[0].lName).toBe('Strauss');

        // 6 represents a low D. This excludes the Persichetti which has a low C (8)
        const lowestNote = await Work.search({lowestNote: 6});
        expect(lowestNote.length).toBe(1);
        expect(lowestNote[0].lName).toBe('Strauss');
    });
    
    test('should filter based on duration', async () => {
        const maxDuration = await Work.search({ maxDuration: "00:15:29"});
        expect(maxDuration.length).toBe(1);
        expect(maxDuration[0].lName).toBe('Persichetti');
    });
    

    test('should search with multiple filters', async () => {
        const filters = { fName: 'Richard', country: "Germany", eraStyle: "Romantic" }
        const multipleFilters = await Work.search(filters);
        expect(multipleFilters.length).toBe(1);
        expect(multipleFilters[0].lName).toBe('Strauss');
    });
});

describe('Work.addWork()', () => {
    test('should add a new work', async () => {
        const title = "Vince's newest title (posthumous)";
        const mockFormFields = {
            title,
            compId: testIds.composers[1],
            submittedBy: testIds.users[1]
        };
        const newWorkId = await Work.addWork(mockFormFields);
        expect(newWorkId).toEqual(expect.any(Number));

        const confirmation = await Work.getWork(newWorkId);
        expect(confirmation.title).toBe(title);
        
        // fields other than { title, compId, submittedBy } are null
        expect(confirmation.duration).toBe(null);
        expect(confirmation.difficulty).toEqual(null);
    });
    
    test('should throw error if missing compId or missing submittedBy', async () => {
        const title = "MISSING ID";

        try {
            await Work.addWork({
                title,
                submittedBy: testIds.users[0]
            });
        } catch (error) {
            expect(error).toEqual(new BadRequestError('Composer not found. Please include a valid composer id.'));
        }
        
        try {
            await Work.addWork({
                title,
                compId: testIds.composers[0]
            });
        } catch (error) {
            expect(error).toEqual(new BadRequestError(`User not found. Please include a valid user id.`));
        }
    });
    
    test('should throw error if bad id', async () => {
        const title = "ZERO IS NOT A GOOD ID";

        try {
            await Work.addWork({
                title,
                compId: 0,
                submittedBy: testIds.users[0]
            });
        } catch (error) {
            expect(error).toEqual(new BadRequestError('Composer not found. Please include a valid composer id.'));
        }
        
        try {
            await Work.addWork({
                title,
                compId: testIds.composers[0],
                submittedBy: 0
            });
        } catch (error) {
            expect(error).toEqual(new BadRequestError(`User not found. Please include a valid user id.`));
        }
    });
});

describe('Work.updateWork()', () => {
    const testWork = {
        title: 'testTitle', 
        duration: '12:34:56', 
        eraStyle: 'test era', 
        highestNote: 4, 
        lowestNote: 6, 
        difficulty: 'test difficulty', 
        techniques: 'test techniques', 
        clef: 'test clef', 
        compositionYr: '1812-01-01', 
        accompType: 'test accompaniment type', 
        accompDifficulty: 'test accomp difficulty'
    };
    
    test('should not update submitted_by', async () => {
        testWork.submittedBy = testIds.users[1];
        testWork.compId = testIds.composers[1];
        const testWorkId = await Work.addWork(testWork);

        // attempt to update submittedBy
        testWork.submittedBy = testIds.users[0];
        const updatedWorkId = await Work.updateWork(testWorkId, testWork);
        
        const proveIt = await db.query(`
            SELECT 
                submitted_by AS "submittedBy" 
            FROM works
            WHERE id = ${updatedWorkId};`);

        expect(proveIt.rows[0].submittedBy).not.toBe(testIds.users[0]);
        expect(proveIt.rows[0].submittedBy).toBe(testIds.users[1]);
    });

    test('should update any/all fields, except submitted_by', async () => {
        // add new work
        testWork.compId = testIds.composers[1];
        testWork.submittedBy = testIds.users[1];
        const testWorkId = await Work.addWork(testWork);
        
        // update a few fields (ps - do not attempt to update "submitted_by")
        const duration = '00:00:01';
        const eraStyle = 'Dawning of the age of Aquarius';
        testWork.duration = duration;
        testWork.eraStyle = eraStyle;
        delete testWork.submitted_by;
        
        const updatedTestWorkId = await Work.updateWork(testWorkId, testWork);
        expect(updatedTestWorkId).toBe(testWorkId);

        // check to prove if db was updated
        const proveIt = await db.query(` 
            SELECT
                title,
                TO_CHAR(duration, 'MI:SS') AS "duration",
                era_style AS "eraStyle"
            FROM works
            WHERE id = ${updatedTestWorkId}`);
        expect(proveIt.rows[0].title).toBe(testWork.title);
        expect(proveIt.rows[0].duration).toBe('00:01');
        expect(proveIt.rows[0].eraStyle).toBe(eraStyle);
    });
     
});
    
describe('Work.deleteWork()', () => {
    test("should delete the Parable. It's not that great anyways.", async () => {
        const deleteResp = await Work.deleteWork(testIds.works[1]);
        expect(deleteResp).toBe(undefined);

        const oneWorkLeft = await db.query(`SELECT * FROM works;`);
        expect(oneWorkLeft.rows.length).toBe(1);
        expect(oneWorkLeft.rows[0].title).toBe('Concerto #1');
        expect(oneWorkLeft.rows[1]).toBe(undefined);
    });

    test('should throw error if work not found - deleteWork()', async () => {
        try {
            await Work.deleteWork(0);
        } catch (error) {
            expect(error).toEqual(new NotFoundError(`Work with id - 0 not found.`));
        }
    });
});

 