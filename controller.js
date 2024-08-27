const { selectTopics, extractAPI } = require(".//model");

exports.getTopics = (req, res, next) => {
  console.log("controller invoked");

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
