

-- JOIN comments to works
SELECT title, comment FROM works JOIN comments ON works.id = works_id;

-- JOIN users to works
SELECT title, u.first_name FROM works JOIN users u ON u.id = submitted_by;

-- JOIN composers to works
SELECT title, last_name, highest_note FROM works JOIN composers ON composer_id = composers.id WHERE composer_id = 1;

-- JOIN comments and composers to works
SELECT title, last_name, highest_note, comment FROM works JOIN comments ON works.id = works_id JOIN composers ON composer_id = composers.id WHERE composer_id = 1;

-- JOIN users and composers to works
SELECT title, highest_note, u.first_name, c.last_name FROM works JOIN users u ON u.id = submitted_by JOIN composers c ON composer_id = c.id WHERE composer_id = 1;



-----------------------------------------------------


-- I need to figure out how to query all 4 tables at once


-----------------------------------------------------



-- JOIN users to comments
SELECT u.first_name, comment FROM comments JOIN users u ON user_id = u.id;

-- JOIN works to comments (both are same)
SELECT title, comment FROM comments JOIN works ON works.id = works_id;
SELECT title, comment FROM comments JOIN works ON works_id = works.id;

-- JOIN users and works to comments
SELECT title, comment, u.first_name FROM comments JOIN works ON works_id = works.id JOIN users u ON user_id = u.id;



