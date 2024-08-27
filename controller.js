const { selectTopics } = require(".//model");

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
