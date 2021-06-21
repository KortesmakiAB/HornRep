INSERT INTO users (
                    username, 
                    first_name, 
                    last_name, 
                    email, 
                    password, 
                    category)
VALUES 
('sSchouten1', 'Sarah', 'Schouten', 'sarah@awesomeSite.com', '$2b$12$AZH7virni5jlTTiGgEg4zu3lSvAw68qVEfSIOjJ3RqtbJbdW/Oi5q', 'academia'),
('abrant1', 'Aaron', 'Brant', 'aaron@awesomeSite.com', '$2b$12$AZH7virni5jlTTiGgEg4zu3lSvAw68qVEfSIOjJ3RqtbJbdW/Oi5q', 'academia');

INSERT INTO composers (
                        first_name,
                        last_name,
                        country,
                        -- birth_yr,
                        -- death_yr,
                        gender)
VALUES
('Richard', 'Strauss', 'Germany', 'male'),
('Vincent', 'Persichetti', 'United States', 'male');

INSERT INTO works (
                    title, 
                    composer_id, 
                    submitted_by, 
                    era_style, 
                    highest_note, 
                    lowest_note, 
                    difficulty, 
                    techniques, 
                    clef, 
                    composition_yr, 
                    accompaniment_type, 
                    accompaniment_difficulty)
VALUES 
('concerto #1', 1, 1, 'romantic', 'b-flat', 'd', 'difficult', null, 'treble', 1854, 'orchestra, piano', 'medium'),
('Parable for solo horn', 2, 1, 'modern', 'b', 'c', 'difficult', 'flutter tongue, double-tongue', 'treble, bass', 1941, 'unacompannied', null);

INSERT INTO comments (
                        comment,
                        works_id
)
VALUES
('this is a monumental work for horn. genius', 1),
('this is a terible work for horn. attrocious', 1);

-- INSERT INTO comment_user (
--                             comment_id,
--                             user_id
-- )
-- VALUES
-- (1, )