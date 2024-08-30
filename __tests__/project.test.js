const seed = require("../db/seeds/seed");
const request = require("supertest");
const app = require("../app");
const db = require("../db/connection");
const jestSorted = require("jest-sorted");
const {
  articleData,
  commentData,
  topicData,
  userData,
} = require("../db/data/test-data/index");
const articles = require("../db/data/test-data/articles");

beforeEach(() => seed({ articleData, commentData, topicData, userData }));
afterAll(() => {
  db.end();
});

describe("/api/topics", () => {
  test("GET:200 returns an array of all topics", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body }) => {
        body.forEach((topic) => {
          expect(topic).toHaveProperty("description");
          expect(topic).toHaveProperty("slug");
        });
      });
  });
  test("GET:200 returns an array with all topics", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body }) => {
        expect(body.length).toBe(3);
      });
  });
});

describe("api/ When passed a none existent path", () => {
  test("get 404: returns a string if handed a none existent path", () => {
    return request(app)
      .get("/api/notapath")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not found");
      });
  });
});

describe("GET/api", () => {
  test("200 returns all the documentation from the documentation file", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body }) => {
        expect(body).toHaveProperty("GET /api");
        expect(body).toHaveProperty("GET /api/topics");
        expect(body).toHaveProperty("GET /api/articles");
      });
  });
});

describe("GET /api/articles/:article_id", () => {
  test("200 returns an article object", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then(({ body }) => {
        expect(body).toHaveProperty("author");
        expect(body).toHaveProperty("title");
        expect(body).toHaveProperty("article_id");
        expect(body).toHaveProperty("body");
        expect(body).toHaveProperty("topic");
        expect(body).toHaveProperty("created_at");
        expect(body).toHaveProperty("votes");
        expect(body).toHaveProperty("article_img_url");
      });
  });

  test("returns invalid id when handed invalid id", () => {
    return request(app)
      .get("/api/articles/hello")
      .expect(400)
      .then(({ body }) => {
        expect(body).toEqual({ msg: "invalid id" });
      });
  });
  test("returns id does not exist when handed valid id but it doesnt exist", () => {
    return request(app)
      .get("/api/articles/999")
      .expect(404)
      .then(({ body }) => {
        expect(body).toEqual({ msg: "Not found" });
      });
  });
});

describe("GET /api/articles", () => {
  test("returns all the objects from api artcles", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        expect(body.length).toBe(13);

        body.forEach((element) => {
          expect(element).toHaveProperty("author");
          expect(element).toHaveProperty("title");
          expect(element).toHaveProperty("article_id");
          expect(element).toHaveProperty("topic");
          expect(element).toHaveProperty("created_at");
          expect(element).toHaveProperty("votes");
          expect(element).toHaveProperty("article_img_url");
          expect(element).toHaveProperty("comment_count");
        });
      });
  });

  test("returns all the objects from api in descending order based on date", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        expect(body).toBeSortedBy("created_at", {
          descending: true,
        });
      });
  });
});

describe("/api/articles/:article_id/comments", () => {
  test("gets all comments on an article", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({ body }) => {
        expect(body.msg.length > 0).toBe(true);

        body.msg.forEach((comment) => {
          expect(comment).toHaveProperty("comment_id");
          expect(comment).toHaveProperty("votes");
          expect(comment).toHaveProperty("created_at");
          expect(comment).toHaveProperty("author");
          expect(comment).toHaveProperty("created_at");
          expect(comment).toHaveProperty("votes");
          expect(comment).toHaveProperty("body");
          expect(comment).toHaveProperty("article_id");
          expect(comment.article_id).toBe(1);
        });
      });
  });
  test("returns invalid id when handed invalid id", () => {
    return request(app)
      .get("/api/articles/hello/comments")
      .expect(400)
      .then(({ body }) => {
        expect(body).toEqual({ msg: "invalid id" });
      });
  });
  test("returns id does not exist when handed valid id but it doesnt exist", () => {
    return request(app)
      .get("/api/articles/999/comments")
      .expect(404)
      .then(({ body }) => {
        expect(body).toEqual({ msg: "Not found" });
      });
  });
});

describe("/api/articles/:article_id/comments", () => {
  test("accepts a body with username and body responds with the posted comment", () => {
    return request(app)
      .post("/api/articles/2/comments")
      .send({ username: "butter_bridge", body: "I really like Wing Chun" })
      .expect(201)
      .then(({ body }) => {
        expect(body.article).toHaveProperty("comment_id", 19);
        expect(body.article).toHaveProperty("body", "I really like Wing Chun");
        expect(body.article).toHaveProperty("article_id", 2);
        expect(body.article).toHaveProperty("author", "butter_bridge");
        expect(body.article).toHaveProperty("votes", 0);
        expect(body.article).toHaveProperty("created_at");
      });
  });
  test("returns a message if username doensn't exist", () => {
    return request(app)
      .post("/api/articles/2/comments")
      .send({ username: "bruce_lee", body: "I really like Wing Chun" })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid input");
      });
  });
  test("returns a message if the article doesn't exist", () => {
    return request(app)
      .post("/api/articles/999/comments")
      .send({ username: "butter_bridge", body: "I really like Wing Chun" })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid input");
      });
  });
});

describe("PATCH /api/articles/:article_id", () => {
  test("updates the article specified by the amoubt of votes passed in an object", () => {
    return request(app)
      .patch("/api/articles/4/")
      .send({ inc_votes: 1 })
      .expect(200)
      .then(({ body }) => {
        expect(body.updatedArticle.votes).toBe(1);
      });
  });
  test("returns an error when passed an invalid article id", () => {
    return request(app)
      .patch("/api/articles/not_an_id/")
      .send({ inc_votes: 1 })
      .expect(400)
      .then(({ body }) => {
        expect(body).toEqual({ msg: "Invalid input" });
      });
  });
  test("returns an error when vote is not a number", () => {
    return request(app)
      .patch("/api/articles/4/")
      .send({ inc_votes: "invalid vote" })
      .expect(400)
      .then(({ body }) => {
        expect(body).toEqual({ msg: "Invalid input" });
      });
  });
  test("returns an error when passed an article that does not exist", () => {
    return request(app)
      .patch("/api/articles/9999/")
      .send({ inc_votes: 1 })
      .expect(404)
      .then(({ body }) => {
        expect(body).toEqual({ msg: "not found" });
      });
  });
});

describe("/api/comments/:comment_id", () => {
  test("comment should be removed, and return an empty object for a body", () => {
    return request(app)
      .delete("/api/comments/1/")
      .expect(204)
      .then(({ body }) => {
        expect(body).toEqual({});

        return request(app)
          .get("/api/articles/1/comments")
          .expect(200)
          .then(({ body }) => {
            const commentOne = body.msg.filter(
              (comment) => comment.comment_id === 1
            );

            expect(commentOne.length).toBe(0);
          });
      });
  });
  test("returns an error when id is not a number", () => {
    return request(app)
      .delete("/api/comments/not_a_number")
      .expect(400)
      .then(({ body }) => {
        expect(body).toEqual({ msg: "Invalid input" });
      });
  });
  test("returns an error when id is not found", () => {
    return request(app)
      .delete("/api/comments/9999")
      .expect(404)
      .then(({ body }) => {
        expect(body).toEqual({ msg: "not found" });
      });
  });
});

describe("api/users", () => {
  test("responds with the an array or users objects", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body }) => {
        expect(body.users.length).toBe(4);

        body.users.forEach((user) => {
          expect(user).toHaveProperty("username");
          expect(user).toHaveProperty("name");
          expect(user).toHaveProperty("avatar_url");
        });
      });
  });
});

describe("/api/articles? sort and order", () => {
  test("returns an array of articles sorted by created_at when passed /api/articles?sort_by&order", () => {
    return request(app)
      .get("/api/articles?sort_by&order")
      .expect(200)
      .then(({ body }) => {
        expect(body.length).toBe(13);
        expect(body).toBeSortedBy("created_at", {
          descending: true,
        });

        body.forEach((element) => {
          expect(element).toHaveProperty("author");
          expect(element).toHaveProperty("title");
          expect(element).toHaveProperty("article_id");
          expect(element).toHaveProperty("topic");
          expect(element).toHaveProperty("created_at");
          expect(element).toHaveProperty("votes");
          expect(element).toHaveProperty("article_img_url");
          expect(element).toHaveProperty("comment_count");
        });
      });
  });
  test("returns an array of artices sorted by titles descending when passed /api/articles?sort_by=title&order=desc", () => {
    return request(app)
      .get("/api/articles?sort_by=title&order=desc")
      .expect(200)
      .then(({ body }) => {
        expect(body.length).toBe(13);
        expect(body).toBeSortedBy("title", {
          descending: true,
        });

        body.forEach((element) => {
          expect(element).toHaveProperty("author");
          expect(element).toHaveProperty("title");
          expect(element).toHaveProperty("article_id");
          expect(element).toHaveProperty("topic");
          expect(element).toHaveProperty("created_at");
          expect(element).toHaveProperty("votes");
          expect(element).toHaveProperty("article_img_url");
          expect(element).toHaveProperty("comment_count");
        });
      });
  });
  test("returns an array of artices sorted by topic ascending when passed /api/articles?sort_by=title&order=asc", () => {
    return request(app)
      .get("/api/articles?sort_by=topic&order=asc")
      .expect(200)
      .then(({ body }) => {
        expect(body.length).toBe(13);
        expect(body).toBeSortedBy("topic", {
          descending: false,
        });

        body.forEach((element) => {
          expect(element).toHaveProperty("author");
          expect(element).toHaveProperty("title");
          expect(element).toHaveProperty("article_id");
          expect(element).toHaveProperty("topic");
          expect(element).toHaveProperty("created_at");
          expect(element).toHaveProperty("votes");
          expect(element).toHaveProperty("article_img_url");
          expect(element).toHaveProperty("comment_count");
        });
      });
  });
  test("returns an error when passed invalid sort_by", () => {
    return request(app)
      .get("/api/articles?sort_by=not_a_value&order=asc")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid input");
      });
  });
  test("returns an error when passed invalid order by", () => {
    return request(app)
      .get("/api/articles?sort_by==incorrectparam")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid input");
      });
  });
});

describe("GET /api/articles (topic query)", () => {
  test("returns an array of topics that match mitch", () => {
    return request(app)
      .get("/api/articles?topic=mitch")
      .expect(200)
      .then(({ body }) => {
        body.forEach((article) => {
          expect(article.topic).toBe("mitch");
        });
      });
  });
  test("returns not found if given none existent topic", () => {
    return request(app)
      .get("/api/articles?topic=banana")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("not found");
      });
  });
  test("returns all articles if no parameter given ", () => {
    return request(app)
      .get("/api/articles?topic=banana")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("not found");
      });
  });
});
