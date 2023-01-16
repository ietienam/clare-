require("dotenv").config();
const express = require("express");
const schedulerRoutes = require("./src/routes/schedule");

const app = express();

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

app.use("/api/schedule", schedulerRoutes);

app.all("*", (req, res, next) => {
  next(new Error(`Can't find ${req.originalUrl} on this server`));
});

app.use((err, req, res, next) => {
  res.json(err);
});

module.exports = app;
