const {
  getTopics,
  getAPI,
  getArticle,
  getArticles,
  getComments,
} = require("./controller");
const express = require("express");

const app = express();

app.get("/api/topics", getTopics);

app.get("/api/articles/:id", getArticle);

app.get("/api/articles/", getArticles);

app.get("/api", getAPI);

app.get("/api/articles/:article_id/comments", getComments);

app.use((req, res, next) => {
  res.status(404).send({ msg: "Not found" });
});

app.use((err, req, res, next) => {
  if (err === "invalid id") {
    res.status(400).send({ msg: "invalid id" });
  } else {
    res.status(404).send({ msg: "not found" });
  }
});

module.exports = app;
