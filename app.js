const { getTopics } = require("./controller");
const express = require("express");

const app = express();

app.get("/api/topics", getTopics);

app.use((req, res, next) => {
  res.status(404).send({ msg: "Path not found" });
});

app.use((err, req, res, next) => {
  res.status(404).send({ msg: "consolemiddleware error hit" });
});

module.exports = app;
