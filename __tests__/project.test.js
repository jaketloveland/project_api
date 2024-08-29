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

describe("When passed a none existent path", () => {
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

describe("CORE: GET /api/articles", () => {
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
