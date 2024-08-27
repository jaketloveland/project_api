const { getTopics, getAPI } = require("./controller");
const express = require("express");

const app = express();

app.get("/api/topics", getTopics);

app.get("/api", getAPI);

app.use((req, res, next) => {
  res.status(404).send({ msg: "Path not found" });
});

app.use((err, req, res, next) => {
  console.log(err, "<---err");
  res.status(404).send({ msg: "not found" });
});

module.exports = app;
