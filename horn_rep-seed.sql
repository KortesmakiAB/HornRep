INSERT INTO users (
                    username, 
                    first_name, 
                    last_name, 
                    email, 
                    password, 
                    category,
                    is_admin)
VALUES 
('sSchouten1', 'Sarah', 'Schouten', 'sarah@awesomeSite.com', '$2b$12$AZH7virni5jlTTiGgEg4zu3lSvAw68qVEfSIOjJ3RqtbJbdW/Oi5q', 'academia', true),
('abrant1', 'Aaron', 'Brant', 'aaron@awesomeSite.com', '$2b$12$AZH7virni5jlTTiGgEg4zu3lSvAw68qVEfSIOjJ3RqtbJbdW/Oi5q', 'academia', true);

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
                    duration,
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
('concerto #1', 1, 1, '00:15:30', 'romantic', 'b-flat', 'd', 'difficult', null, 'treble', '1854-01-01', 'orchestra, piano', 'medium'),
('Parable for solo horn', 2, 1, '00:11:15', 'modern', 'b', 'c', 'difficult', 'flutter tongue, double-tongue', 'treble, bass', '1941-01-01', 'unacompannied', null);

INSERT INTO comments (
                        comment,
                        user_id,
                        work_id)
VALUES
('this is a monumental work for horn. genius', 1, 1),
('this is a terible work for horn. attrocious', 1, 1);

