///////////////////////////////////////////
// Range System

// DB can compare number easily... 2 > 1
// Conversely, it would not make much sense to try this... F5 < F#5
// So, highest_note and lowest_note are stored in the db as integers
// the lowest note (super pedal c) is 0.
    //  eg. 4 = Shost 5, pedal E.
// the higher the note, the higher the number
    // eg. 48 = ShortCall, high C.

// the search form must display a highest note jpeg or text, but the form submission must be an integer.


///////////////////////////////////////////
// DATA STRUCTURE to encapsulate range data
// array of objects
// object properties: path(img), name(eg 'F#4')
// the array index corresponds to the integer stored in the database.


export function createRangeArr() {
    const RangeArr = [];
    const chromaticScaleAscending = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'];

    for (let octave = 2; octave <= 6; octave++){
        for (let note of chromaticScaleAscending){
            RangeArr.push({ 
                fullName: `${note}${octave}`,
                abbrevName: note,
            });
        }
    }

    return RangeArr;
}
