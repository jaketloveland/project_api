# Northcoders News API

# About

This project is a Node.js backend application that provides a RESTful API for managing and retrieving data from a relational database. The application is designed to handle complex queries, filtering, and sorting of data while ensuring robust error handling and test coverage. Key features of the project include:

API Endpoints: Serves multiple endpoints that retrieve data from tables like articles, comments, orders, and customers. It supports filtering, sorting, and selecting specific data, such as filtering articles by topic or retrieving specific articles by ID.

SQL Database Integration: Uses SQL queries to interact with a relational database (e.g., PostgreSQL). The project uses JOIN clauses to combine data from related tables and perform advanced querying operations.

Error Handling: Implements error handling to manage edge cases, such as handling cases where data is not found or where database operations fail.

Automated Testing: Includes unit and integration tests using Jest to ensure that API endpoints work as expected, including verifying data retrieval and error scenarios.

This backend application is intended to power a data-driven web application or serve as a standalone service for interacting with a relational database.

---

# Hosted Version

https://articlesapi-516n.onrender.com/

# Prerequisites

Node.js: Version v22.4.1 or later
PostgreSQL: Version 12 or higher

# Installation

1. To clone this database, open the terminal in VS CODE or your favourite source code editor and type git clone https://github.com/jaketloveland/project_api/ in the terminal and press enter

2. To install dependencies type npm install and press enter

3. You will need to create two .env files for your project: .env.test and .env.development in the root folder.
   In test add PGDATABASE=nc_news_test and into development add PGDATABASE=nc_news

4. To set up the databases run
   npm run setup-dbs
   npm run seed

5. To run tests
   npm run test

This portfolio project was created as part of a Digital Skills Bootcamp in Software Engineering provided by [Northcoders](https://northcoders.com/)

# API Endpoints

Topics
GET /api/topics: Retrieves a list of all topics.
Articles
GET /api/articles/:id: Retrieves a specific article by its ID.
GET /api/articles: Retrieves a list of all articles.
PATCH /api/articles/:article_id: Updates the vote count for a specific article by its ID.
Comments
GET /api/articles/:article_id/comments: Retrieves comments for a specific article by its ID.
POST /api/articles/:article_id/comments: Adds a new comment to a specific article by its ID.
