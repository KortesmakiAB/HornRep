
-- DROP DATABASE interval_play;
-- CREATE DATABASE interval_play;
\connect interval_play

DROP TABLE IF EXISTS intervals;

CREATE TABLE intervals (
    "id" SERIAL PRIMARY KEY,
    "interval" interval,
    "comp_date" date,
    "ts" TIMESTAMP NOT NULL DEFAULT NOW(),
    "tsz" timestamptz NOT NULL DEFAULT NOW()
);

INSERT INTO intervals (
    interval,
    comp_date
)
VALUES
('5 minutes 30 seconds', '2000-12-31'),
('4 minutes 15 seconds', '2021-07-23'),
('3 minutes 66 seconds', '1985-01-01'),
('77 minutes 77 seconds', '1500-01-01'),
('60 minutes', null),
('23 seconds', null);


-- -------------------
-- SELECT * FROM intervals WHERE interval = '4 minutes 15 seconds';
--  id | interval
-- ----+----------
--   2 | 00:04:15

-- -- intervalstyle = 'postgres' is default. This query and previous are the same.
-- SET intervalstyle = 'postgres'; 
-- SELECT * FROM intervals WHERE interval = '4 minutes 15 seconds';

-- SET intervalstyle = 'postgres_verbose';
-- SELECT * FROM intervals WHERE interval = '4 minutes 15 seconds';
--  id |     interval
-- ----+------------------
--   2 | @ 4 mins 15 secs

-- SET intervalstyle = 'postgres_verbose';
-- SELECT * FROM intervals WHERE interval = '00:04:15';
--  id |     interval
-- ----+------------------
--   2 | @ 4 mins 15 secs


-- SELECT TO_CHAR(interval, 'MI:SS') AS duration FROM intervals WHERE interval = '4 minutes 15 seconds';
--  duration
-- ----------
--  04:15

----------------------------- get year only, NOT month or day.
-- SELECT TO_CHAR( comp_date, 'YYYY') FROM intervals WHERE comp_date = '1500-01-01';
--  to_char
-- ---------
--  1500

--  SELECT EXTRACT( year from comp_date) AS YEAR FROM intervals WHERE comp_date = '1500-01-01';
--   year
-- ------
--  1500

-- SELECT date(tsz) FROM intervals;
-- SELECT * FROM intervals;
-- SELECT TO_CHAR(tsz, 'mm/dd/yyyy') from intervals;