const seed = require("../db/seeds/seed");
const request = require("supertest");
const app = require("../app");
const db = require("../db/connection");

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
