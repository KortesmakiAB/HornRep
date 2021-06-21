CREATE TABLE "users" (
  "id" SERIAL PRIMARY KEY,
  "username" varchar UNIQUE NOT NULL,
  "first_name" varchar NOT NULL,
  "last_name" varchar NOT NULL,
  "email" varchar UNIQUE NOT NULL,
  "password" varchar NOT NULL,
  "category" varchar
);

CREATE TABLE "composers" (
  "id" SERIAL PRIMARY KEY,
  "first_name" varchar NOT NULL,
  "last_name" varchar NOT NULL,
  "country" varchar,
  -- "birth_yr" INTEGER,
  -- "death_yr" INTEGER,
  "gender" varchar
);

CREATE TABLE "works" (
  "id" SERIAL PRIMARY KEY,
  "title" varchar NOT NULL,
  "composer_id" INTEGER NOT NULL REFERENCES composers ON DELETE CASCADE,
  "submitted_by" INTEGER NOT NULL REFERENCES users ON DELETE CASCADE,
  "era_style" varchar,
  "highest_note" varchar,
  "lowest_note" varchar,
  "difficulty" varchar,
  "techniques" varchar,
  "clef" varchar,
  "composition_yr" INTEGER,
  "accompaniment_type" varchar,
  "accompaniment_difficulty" varchar
);



CREATE TABLE "comments" (
  "id" SERIAL PRIMARY KEY,
  "comment" varchar NOT NULL,
  -- "user_id" INTEGER NOT NULL REFERENCES users ON DELETE CASCADE,
  "works_id" INTEGER NOT NULL REFERENCES works ON DELETE CASCADE
);

-- CREATE TABLE "comment_user" (
--   "comment_id" INTEGER NOT NULL REFERENCES comments ON DELETE CASCADE,
--   "user_id" INTEGER NOT NULL REFERENCES users ON DELETE CASCADE
-- );

