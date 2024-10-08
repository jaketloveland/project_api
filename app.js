const cors = require("cors");

const {
  getTopics,
  getAPI,
  getArticle,
  getArticles,
  getComments,
  postComment,
  patchVotes,
  deleteComment,
  getUsers,
} = require("./controller");
const express = require("express");

const app = express();

app.use(cors());

app.use(express.json());

app.get("/api/topics", getTopics);

app.get("/api/articles/:id", getArticle);

app.get("/api/articles/", getArticles);

app.get("/api", getAPI);

app.get("/api/articles/:article_id/comments", getComments);

app.get("/api/users", getUsers);

app.post("/api/articles/:article_id/comments", postComment);

app.delete("/api/comments/:comment_id", deleteComment);

app.patch("/api/articles/:article_id", patchVotes),
  app.use((req, res, next) => {
    res.status(404).send({ msg: "Not found" });
  });

app.use((err, req, res, next) => {
  if (err === "invalid id") {
    res.status(400).send({ msg: "invalid id" });
  } else if (err === "invalid input") {
    res.status(400).send({ msg: "Invalid input" });
  } else {
    res.status(404).send({ msg: "not found" });
  }
});

module.exports = app;
