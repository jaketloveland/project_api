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
    .query(
      "SELECT articles.*, (select count(*) as comment_count from comments where article_id = $1) FROM articles WHERE articles.article_id=$1  ",
      [id]
    )
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject("Not Found");
      } else {
        return rows;
      }
    });
};

exports.selectAllArticles = (option, input1, input2) => {
  // Filter by topic
  if (option === "Filter topic") {
    return db
      .query(
        "SELECT author, title, article_id, topic, created_at, votes, article_img_url FROM articles WHERE topic = $1 ORDER BY created_at DESC",
        [input1]
      )
      .then((filteredTopics) => {
        if (filteredTopics.rows.length === 0) {
          return Promise.reject("not found");
        } else {
          return filteredTopics.rows;
        }
      });

    // sort by column and order
  } else if (option === "sort by column") {
    const column = input1 || "created_at";
    const order = input2 || "DESC";

    const greenlistColumns = [
      "author",
      "title",
      "article_id",
      "topic",
      "created_at",
      "votes",
    ];

    const greenListOrder = ["asc", "desc", "ASC", "DESC"];

    if (greenlistColumns.includes(column) && greenListOrder.includes(order)) {
      const query = `SELECT author, title, article_id, topic, created_at, votes, article_img_url FROM articles ORDER BY ${column} ${order}`;

      return db.query(query).then((articlesSorted) => {
        return articlesSorted.rows;
      });
    } else {
      return Promise.reject("invalid input");
    }

    // default return all articles
  } else {
    return db
      .query(
        "SELECT author, title, article_id, topic, created_at, votes, article_img_url FROM articles ORDER BY created_at DESC"
      )
      .then((allArticles) => {
        return allArticles.rows;
      });
  }
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

exports.ammendVotes = (votes, article_id) => {
  return db
    .query(
      "UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING *",
      [votes, article_id]
    )
    .then((patchedArticle) => {
      if (patchedArticle.rows.length === 0) {
        return "not found";
      } else {
        return patchedArticle.rows[0];
      }
    });
};

exports.removeComment = (commentID) => {
  return db
    .query("DELETE FROM comments WHERE comment_id = $1", [commentID])
    .then((output) => {
      if (output.rowCount === 0) {
        return "not found";
      }

      return output;
    });
};

exports.extractUsers = () => {
  return db.query("SELECT * FROM users").then((users) => {
    return users.rows;
  });
};
