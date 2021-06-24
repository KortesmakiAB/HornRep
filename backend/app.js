"use strict";

/** Express app. */

const express = require("express");
const cors = require("cors");

const { NotFoundError } = require("./expressError");

// const { authenticateJWT } = require("./middleware/auth");

// const authRoutes = require("./routes/auth");
// const usersRoutes = require("./routes/users");
// const searchRoutes = require("./routes/search");
// const worksRoutes = require("./routes/works");
// const commentsRoutes = require("./routes/comments");

const morgan = require("morgan");

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("tiny"));
// app.use(authenticateJWT);

// app.use("/auth", authRoutes);
// app.use("/users", usersRoutes);
// app.use("/search", searchRoutes);
// app.use("/works", worksRoutes);
// app.use("/comments", commentsRoutes);


/** Handle 404 errors -- this matches everything */
app.use(function (req, res, next) {
  return next(new NotFoundError());
});

/** Generic error handler; anything unhandled goes here. */
app.use(function (err, req, res, next) {
  if (process.env.NODE_ENV !== "test") console.error(err.stack);
  const status = err.status || 500;
  const message = err.message;

  return res.status(status).json({
    error: { message, status },
  });
});

module.exports = app;
