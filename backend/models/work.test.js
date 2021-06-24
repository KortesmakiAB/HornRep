"use strict"

const db = require("../db.js");
const { NotFoundError } = require("../expressError");
const Work = require("./work.js");
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

describe ('GET 1 work - getWork()', () => {
    test('should get 1 work', async () => {
        const worksResp = await Work.getWork(testIds.works[0]);
        // TODO: change test when comments functionality added
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
        });
    });

    test('should throw NotFoundError if work not found.', async () => {
        try {
            await Work.getWork(0);
        } catch (error) {
            expect(error).toEqual(new NotFoundError(`Work not found`));
        }
    });
});

describe('Work Search - search()', () => {
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

