const { selectTopics, extractAPI, selectArticle } = require(".//model");

exports.getTopics = (req, res, next) => {
  selectTopics()
    .then((topicsData) => {
      res.status(200).send(topicsData);
    })
    .catch((err) => {
      console.log("this is triiped");
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
