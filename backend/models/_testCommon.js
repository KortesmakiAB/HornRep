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
      accompaniment_difficulty)
    VALUES 
      ('Concerto #1', ${testIds.composers[0]}, ${testIds.users[0]}, '00:15:30', 'romantic', 4, 6, 'medium/difficult', null, 'treble', '1854-01-01', 'orchestra, piano', 'medium'),
      ('Parable for solo horn', ${testIds.composers[1]}, ${testIds.users[0]}, '00:11:15', 'modern', 5, 8, 'difficult', 'flutter tongue, double-tongue', 'treble, bass', '1941-01-01', 'none', null)
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