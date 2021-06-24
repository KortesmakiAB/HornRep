"use strict";

/** Shared config settings for application. **/

// read .env files and make environmental variables
require("dotenv").config();
require("colors");

// for JWT
const SECRET_KEY = process.env.SECRET_KEY || "secret-dev-mode";

const PORT = +process.env.PORT || 3001;

function getDatabaseUri() {
    return (process.env.NODE_ENV === "test")
        ? "horn_rep_test"
        : process.env.DATABASE_URL || "horn_rep";
}

// Speed up bcrypt during tests, since the algorithm safety isn't being tested
const BCRYPT_WORK_FACTOR = process.env.NODE_ENV === "test" ? 1 : 12;

console.log("Jobly Config:".green);
console.log("SECRET_KEY:".yellow, SECRET_KEY);
console.log("PORT:".yellow, PORT.toString());
console.log("BCRYPT_WORK_FACTOR".yellow, BCRYPT_WORK_FACTOR);
console.log("Database:".yellow, getDatabaseUri());


module.exports = {
  SECRET_KEY,
  PORT,
  BCRYPT_WORK_FACTOR,
  getDatabaseUri,
};
