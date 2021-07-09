'use strict';

// accepts array of keys to convert
function qStringIntConverter (reqQuery = {}, arr = []) {
    // parseInt typically converts argument to NaN if it's not a number.
    // this function only converts string-int to an integer if string-int can be converted to an integer.

    arr.forEach(key => {
        const val = parseInt(reqQuery[key]);
        if (!Number.isNaN(val)) reqQuery[key] = val;
    });

    return reqQuery;
}

module.exports = qStringIntConverter;