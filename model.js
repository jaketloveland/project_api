const db = require("./db/connection");

exports.selectTopics = () => {
  return db.query("SELECT * FROM topics").then((topicsData) => {
    return topicsData.rows;
  });
};

exports.extractAPI = () => {
  return require("./endpoints.json");
};

exports.selectArticle = (id) => {
  return db
    .query("SELECT * FROM articles WHERE article_id=$1", [id])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject("Not Found");
      } else {
        return rows;
      }
    });
};

exports.selectAllArticles = () => {
  return db
    .query(
      "SELECT author, title, article_id, topic, created_at, votes, article_img_url FROM articles ORDER BY created_at DESC"
    )
    .then((allArticles) => {
      return allArticles.rows;
    });
};

exports.addComments = (articlesArray) => {
  const promises = articlesArray.map((article) => {
    const articleID = article.article_id;

    return db
      .query("SELECT * FROM comments WHERE article_id = $1", [articleID])
      .then((articleComments) => {
        article.comment_count = articleComments.rows.length;
      });
  });
  return Promise.all(promises).then(() => {
    return articlesArray;
  });
};

exports.selectComments = (articleID) => {
  return db
    .query(
      "SELECT comment_id, votes, created_at, author, body, article_id FROM comments WHERE article_ID = $1 ORDER BY created_at DESC",
      [articleID]
    )
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject("Not Found");
      } else {
        return rows;
      }
    });
};

exports.writeContent = (author, body, article_id) => {
  return db
    .query(
      "INSERT INTO comments (author, body,  article_id) VALUES ($1, $2, $3) RETURNING *",
      [author, body, article_id]
    )
    .then(({ rows }) => {
      return rows;
    })
    .catch((err) => {
      if (err.code === "23503") {
        return Promise.reject("invalid input");
      }
    });
};
