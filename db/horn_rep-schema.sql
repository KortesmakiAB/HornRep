CREATE TABLE "users" (
  "id" SERIAL PRIMARY KEY,
  "username" varchar UNIQUE NOT NULL,
  "first_name" varchar NOT NULL,
  "last_name" varchar NOT NULL,
  "email" varchar UNIQUE NOT NULL,
  "password" varchar NOT NULL,
  "category" varchar,
  "is_admin" boolean NOT NULL DEFAULT FALSE
);

CREATE TABLE "composers" (
  "id" SERIAL PRIMARY KEY,
  "first_name" varchar NOT NULL,
  "last_name" varchar NOT NULL,
  "country" varchar,
  -- "birth_yr" date,
  -- "death_yr" date,
  "gender" varchar
);

-- NOTE:
-- composer_id "ON DELETE SET NULL" - in case there are duplicate composers, can delete 1 without losing the work too.
-- submitted_by "ON DELETE SET NULL" - if a user deletes their account, we want to retain their contributions.

CREATE TABLE "works" (
  "id" SERIAL PRIMARY KEY,
  "title" varchar NOT NULL,
  "composer_id" INTEGER REFERENCES composers ON DELETE SET NULL,
  "submitted_by" INTEGER REFERENCES users ON DELETE SET NULL,
  "duration" INTERVAL,
  "era_style" varchar,
  "highest_note" INTEGER,
  "lowest_note" INTEGER,
  "difficulty" varchar,
  "techniques" varchar,
  "clef" varchar,
  "composition_yr" date,
  "accompaniment_type" varchar,
  "accompaniment_difficulty" varchar,
  "description" varchar
);

CREATE TABLE "comments" (
  "id" SERIAL PRIMARY KEY,
  "comment" varchar NOT NULL,
  "user_id" INTEGER NOT NULL REFERENCES users ON DELETE CASCADE,
  "work_id" INTEGER NOT NULL REFERENCES works ON DELETE CASCADE,
  "time_stamp_tz" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- NOTE:
-- work_id "ON DELETE SET NULL" - in case there are duplicate works, can delete 1 work without losing the work too.
CREATE TABLE "movements" (
  "id" SERIAL PRIMARY KEY,
  "work_id" INTEGER REFERENCES works ON DELETE SET NULL,
  "title" varchar,
  "duration" INTERVAL,
  "difficulty" varchar,
  "highest_note" INTEGER,
  "lowest_note" INTEGER
);

