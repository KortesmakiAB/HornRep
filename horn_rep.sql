\echo 'Delete and recreate horn_rep db?'
\prompt 'Return for yes or control-C to cancel > ' foo

DROP DATABASE horn_rep;
CREATE DATABASE horn_rep;
\connect horn_rep

\i horn_rep-schema.sql
\i horn_rep-seed.sql

-- \echo 'Delete and recreate horn_rep_test db?'
-- \prompt 'Return for yes or control-C to cancel > ' foo

-- DROP DATABASE horn_rep_test;
-- CREATE DATABASE horn_rep_test;
-- \connect horn_rep_test

-- \i horn_rep-schema.sql
