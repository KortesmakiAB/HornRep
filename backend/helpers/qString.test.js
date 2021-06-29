'use strict';

const convertToInt = require('./qString');

describe('convertToInt()', () => {
    test('should accept an object and array of keys. Return the object with indicated values converted to integers', () => {
        const obj = {
            "a": "01",
            "b": 2
        };

        expect(convertToInt(obj, ["a"])).toEqual( {
            "a": 1,
            "b": 2
        });
    });
    
    test('should handle empty/undefined', () => {
        const obj = {
            "a": "",
            "b": " ",
            "c": undefined,
            "d": '01',
            "e": null
        };

        expect(convertToInt(obj, ["a", "b", "c", "d", "e"])).toEqual( {
            "a": "",
            "b": " ",
            "c": undefined,
            "d": 1,
            "e": null
        });
    });
});
