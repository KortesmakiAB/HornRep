### `<Works>`
- Display list of works
- Displays only: Composer, Title, Duration, Level, Era/Style
- Use cards for mobile friendly
- links to `<WorkDetails>`
- handle 'No Results' (sep component?)

### `<WorkDetails>`
- write frontend api to call backend for 1 work details
- call that api
    - somehow wait until the data is loaded to render
    - need a global `<Loading>` which uses a BP spinner
        - add this to `<Home>` as well
        - BP skeleton is also an issue, but prob too much work right now
- display
    - WORK
        - works.id,
        - title,
        - c.first_name AS "fName",
        - c.last_name AS "lName",
        - c.country,
        - c.gender,
        - TO_CHAR(duration, 'MI:SS') AS "duration",
        - era_style AS "eraStyle",
        - highest_note AS "highestNote",
        - lowest_note AS "lowestNote",
        - difficulty,
        - techniques,
        - clef,
        - TO_CHAR( composition_yr, 'YYYY') AS "compYr",
        - accompaniment_type AS "accompType",
        - accompaniment_difficulty AS "accompDifficulty",
        - u.username,
        - submitted_by AS "submittedBy",
        - description (CALL OUT & overflow?)
    - MOVEMENTS
    - COMMENTS



