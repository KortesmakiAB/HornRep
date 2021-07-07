"use strict"

const db = require("../db.js");
const { BCRYPT_WORK_FACTOR } = require("../config");

const testIds = {
  users: [],
  composers: [],
  works: [],
  comments: [],
  movements: []
};

async function commonBeforeAll() {
  await db.query("DELETE FROM works");
  await db.query("DELETE FROM composers");
  await db.query("DELETE FROM users");
  await db.query("DELETE FROM movements");
  
  // -- both test users have the password "password"
  const usersResp = await db.query(`
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
      ('aBrant1', 'Aaron', 'Brant', 'aaron@awesomeSite.com', '$2b$12$AZH7virni5jlTTiGgEg4zu3lSvAw68qVEfSIOjJ3RqtbJbdW/Oi5q', 'academia', true)
    RETURNING id;
  `);
  testIds.users = [...usersResp.rows.map(row => row.id)];

  const composersResp = await db.query(`
    INSERT INTO composers (
      first_name,
      last_name,
      country,
      -- birth_yr,
      -- death_yr,
      gender)
    VALUES
      ('Richard', 'Strauss', 'Germany', 'male'),
      ('Vincent', 'Persichetti', 'United States', 'male')
    RETURNING id;
  `);
  testIds.composers = [...composersResp.rows.map(row => row.id)];

  const worksResp = await db.query(`
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
      accompaniment_difficulty,
      description)
    VALUES 
      ('Concerto #1', ${testIds.composers[0]}, ${testIds.users[0]}, '00:15:30', 'romantic', 46, 18, 'intermediate/advanced', null, 'treble', '1854-01-01', 'orchestra, piano', 'intermediate', 'This early work of Richard Strauss is a standard in the horn’s solo repertoire.  It is often asked for in both orchestral and university auditions.  While a standard among professionals, it is playable by an above-average high school student.  The diverse piece requires lyrical, technical, and heroic playing.  The first movement opens with a cadenza-like passage before transitioning into the more lyrical melody.  It requires lyrical and technical proficiency, in addition to a large dynamic range.  The second movement demands a control of the mid-range at both pianissimo and fortissimo.  The third movement shares the lyrical and technical demands of the first movement.  Due to the work’s length and breadth, endurance is an important consideration regarding placement on a recital program.'),
      ('Parable for solo horn', ${testIds.composers[1]}, ${testIds.users[0]}, '00:11:15', 'modern', 47, 8, 'advanced', 'flutter tongue, double-tongue', 'treble, bass', '1941-01-01', 'unaccompanied', null, 'This unaccompanied work is quite demanding.  Its technical difficulties include mixed meters, difficult intervals, and large leaps.  Lyrically, its phrases demand maturity from the performer.  Even though it is a difficult work it is not inaccessible to the undergraduate student.  This piece is one that challenges the performer and the audience; nevertheless, it is a standard selection in the repertoire.')
    RETURNING id;
  `);
  testIds.works = [...worksResp.rows.map(row => row.id)];

  const commentsResp = await db.query(`
  INSERT INTO comments (
    comment,
    user_id,
    work_id)
  VALUES
    ('this is a monumental work for horn. genius', ${testIds.users[0]}, ${testIds.works[0]}),
    ('this is a terrible work for horn. atrocious', ${testIds.users[0]}, ${testIds.works[0]})
  RETURNING id;
  `);
  testIds.comments = [...commentsResp.rows.map(cmnt => cmnt.id)];


  const movementsResp = await db.query(`
    INSERT INTO movements (
      work_id,
      title,
      duration,
      difficulty,
      highest_note,
      lowest_note
    )
    VALUES
      (${testIds.works[0]}, 'I. Allegro', '00:05:22', 'Difficult', 1, 8),
      (${testIds.works[0]}, 'II. Andante', '00:05:02', 'Difficult', 1, 8),
      (${testIds.works[0]}, 'III. Allegro', '00:05:20', 'Intermediate-Advanced', 1, 8)
    RETURNING id;
  `);
  testIds.movements = [...movementsResp.rows.map(row => row.id)];
}

async function commonBeforeEach() {
  await db.query("BEGIN");
}

async function commonAfterEach() {
  await db.query("ROLLBACK");
}

async function commonAfterAll() {
  await db.end();
}


module.exports = {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
  testIds
};