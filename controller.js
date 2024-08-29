const {
  selectTopics,
  extractAPI,
  selectArticle,
  selectAllArticles,
  addComments,
  selectComments,
  writeContent,
  ammendVotes,
} = require(".//model");
const { patch } = require("./app");

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
  selectAllArticles().then((allArticles) => {
    addComments(allArticles).then((allArticlesWithComments) => {
      res.status(200).send(allArticlesWithComments);
    });
  });
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
  // add else in case its not a number
};
