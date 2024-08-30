const {
  selectTopics,
  extractAPI,
  selectArticle,
  selectAllArticles,
  addComments,
  selectComments,
  writeContent,
  ammendVotes,
  removeComment,
  extractUsers,
  selectAllArticlesWithParams,
} = require(".//model");
const topics = require("./db/data/test-data/topics");

exports.getTopics = (req, res, next) => {
  selectTopics()
    .then((topicsData) => {
      res.status(200).send(topicsData);
    })
    .catch((err) => {
      next(err);
    });
};

exports.getAPI = (req, res, next) => {
  const apiData = extractAPI();
  res.status(200).send(apiData);
};

exports.getArticle = (req, res, next) => {
  const { id } = req.params;

  if (!isNaN(Number(id))) {
    selectArticle(id)
      .then((article) => {
        res.status(200).send(article[0]);
      })
      .catch((err) => {
        next();
      });
  } else {
    next("invalid id");
  }
};

exports.getArticles = (req, res, next) => {
  const queries = Object.keys(req.query);

  // Default no params given
  if (queries.length === 0) {
    selectAllArticles().then((allArticles) => {
      addComments(allArticles).then((allArticlesWithComments) => {
        res.status(200).send(allArticlesWithComments);
      });
    });
    // Filter by topic
  } else if (
    queries.length === 1 &&
    queries.includes("topic") &&
    req.query.topic.length
  ) {
    selectAllArticles("Filter topic", req.query.topic)
      .then((filteredArticles) => {
        res.status(200).send(filteredArticles);
      })
      .catch((err) => {
        next("not found");
      });
  }
  // sort by column

  if (
    queries.length > 0 &&
    queries.length <= 3 &&
    queries.includes("sort_by")
  ) {
    const column = req.query.sort_by;
    const order = req.query.order;

    selectAllArticles("sort by column", column, order)
      .then((articlesSorted) => {
        addComments(articlesSorted).then((articlesSortedWithComments) => {
          res.status(200).send(articlesSortedWithComments);
        });
      })
      .catch((err) => {
        next("invalid input");
      });
  }
};

exports.getComments = (req, res, next) => {
  const articleID = req.params.article_id;
  if (!isNaN(Number(articleID))) {
    selectComments(articleID)
      .then((selectedComments) => {
        res.status(200).send({ msg: selectedComments });
      })
      .catch((err) => {
        next();
      });
  } else {
    next("invalid id");
  }
};

exports.postComment = (req, res, next) => {
  const { username, body } = req.body;
  const article_id = Number(req.params.article_id);

  writeContent(username, body, article_id)
    .then((postedArticle) => {
      res.status(201).send({ article: postedArticle[0] });
    })
    .catch((err) => {
      next(err);
    });
};

exports.patchVotes = (req, res, next) => {
  const newVotes = req.body.inc_votes;
  const article_id = req.params.article_id;

  if (!isNaN(Number(newVotes)) && !isNaN(Number(article_id))) {
    ammendVotes(newVotes, article_id).then((patchedArticle) => {
      if (patchedArticle === "not found") {
        next("not found");
      } else {
        res.status(200).send({ updatedArticle: patchedArticle });
      }
    });
  } else {
    next("invalid input");
  }
};

exports.deleteComment = (req, res, next) => {
  const { comment_id } = req.params;

  if (!isNaN(Number(comment_id))) {
    removeComment(comment_id)
      .then((deletedComment) => {
        if (deletedComment === "not found") {
          next("not found");
        } else {
          res.status(204).send({});
        }
      })
      .catch((err) => {});
  } else {
    next("invalid input");
  }
};

exports.getUsers = (req, res, next) => {
  extractUsers().then((users) => {
    res.status(200).send({ users: users });
  });
};
