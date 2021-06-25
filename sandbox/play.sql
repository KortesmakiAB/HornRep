

-- GET comments about a work
SELECT title, comment FROM works JOIN comments ON works.id = works_id;

-- JOIN users to comments
SELECT * FROM comments JOIN users ON users.id = user_id;

-- JOIN movements to works
SELECT m.title AS mvmt_title, m.duration AS mvmt_duration, m.difficulty AS mvmt_difficulty FROM works JOIN movements m ON works.id = m.work_id;

-- JOIN users to works
SELECT title, u.first_name FROM works JOIN users u ON u.id = submitted_by;

-- JOIN composers to works
SELECT title, last_name, highest_note FROM works JOIN composers ON composer_id = composers.id WHERE composer_id = 1;

-- JOIN comments and composers to works
SELECT title, last_name, highest_note, comment FROM works JOIN comments ON works.id = works_id JOIN composers ON composer_id = composers.id WHERE composer_id = 1;

-- JOIN users and composers to works
SELECT title, highest_note, u.first_name, c.last_name FROM works JOIN users u ON u.id = submitted_by JOIN composers c ON composer_id = c.id WHERE composer_id = 1;

-- getWork() - play
SELECT * FROM works 
JOIN composers c ON composer_id = c.id 
JOIN users u ON u.id = submitted_by
WHERE works.id = 1 ORDER BY c.last_name, c.first_name, title;

-- search() - play
SELECT * FROM works 
JOIN composers c ON composer_id = c.id 
JOIN users u ON u.id = submitted_by
WHERE title ILIKE '%concerto%' ORDER BY c.last_name, c.first_name, title;


-----------------------------------------------------
-- INTERVAL comparison

--  <= or >=
SELECT * from works where duration >= '00:12:00';

-----------------------------------------------------



-- JOIN users to comments
SELECT u.first_name, comment FROM comments JOIN users u ON user_id = u.id;

-- JOIN works to comments (both are same)
SELECT title, comment FROM comments JOIN works ON works.id = works_id;
SELECT title, comment FROM comments JOIN works ON works_id = works.id;

-- JOIN users and works to comments
SELECT title, comment, u.first_name FROM comments JOIN works ON works_id = works.id JOIN users u ON user_id = u.id;


-----------------------------------------------------

INSERT INTO movements (
      work_id,
      title,
      duration,
      difficulty,
      highest_note,
      lowest_note
    )
    VALUES
      (13, 'I. Allegro', '00:05:22', 'Difficult', 1, 8),
      (13, 'II. Andante', '00:05:02', 'Difficult', 1, 8),
      (13, 'III. Allegro', '00:05:20', 'Intermediate-Advanced', 1, 8)
    RETURNING id;


-----------------------------------------------------


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


"comments": Array [
    {
      "comment": "this is a monumental work for horn. genius",
       "comment_date": "06/24/2021",
       "username": "sSchouten1",
    },
    {
       "comment": "this is a terible work for horn. attrocious",
       "comment_date": "06/24/2021",
       "username": "sSchouten1",
    },
],