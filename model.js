const db = require("./db/connection");

exports.selectTopics = () => {
  return db.query("SELECT * FROM topics").then((topicsData) => {
    console.log(topicsData.rows);
    return topicsData.rows;
  });
};
