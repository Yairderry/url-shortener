const request = require("supertest");
const app = require("./app.js");

const urlToShort = { url: "https://www.reddit.com" };
const urlToShort2 = { url: "https://www.google.com" };
const expectedUrlError = { error: "invalid url" };
const urlNotFoundError = { error: "This short url was not found" };
const expectedServersError = { error: "There was an error with our servers" };

describe("shorturl route", () => {
  describe("POST methods", () => {
    const invalidUrlToShort = { url: "reddit" };

    it("Should create a new short url successfully", async () => {
      const response = await request(app)
        .post("/api/shorturl/new")
        .send(urlToShort);

      const expectedResponse = {
        original_url: urlToShort.url,
        short_url: 0,
      };

      expect(response.status).toBe(200);
      expect(response.body).toEqual(expectedResponse);
    });

    it("Should not create a new short url when entering the same url", async () => {
      const response1 = await request(app)
        .post("/api/shorturl/new")
        .send(urlToShort);

      const response2 = await request(app)
        .post("/api/shorturl/new")
        .send(urlToShort);

      const expectedResponse = {
        original_url: urlToShort.url,
        short_url: 0,
      };

      expect(response1.status).toBe(200);
      expect(response1.body).toEqual(expectedResponse);

      expect(response2.status).toBe(200);
      expect(response2.body).toEqual(expectedResponse);
    });

    test("If second short url received === first short url received + 1", async () => {
      const response1 = await request(app)
        .post("/api/shorturl/new")
        .send(urlToShort);

      const response2 = await request(app)
        .post("/api/shorturl/new")
        .send(urlToShort2);

      const expectedResponse = {
        original_url: urlToShort.url,
        short_url: 0,
      };
      const expectedResponse2 = {
        original_url: urlToShort2.url,
        short_url: 1,
      };

      expect(response1.status).toBe(200);
      expect(response1.body).toEqual(expectedResponse);

      expect(response2.status).toBe(200);
      expect(response2.body).toEqual(expectedResponse2);
    });

    it("Should return an error message with status code 400 for invalid url", async () => {
      const response = await request(app)
        .post("/api/shorturl/new")
        .send(invalidUrlToShort);

      expect(response.status).toBe(400);
      expect(response.body).toEqual(expectedUrlError);
    });
  });

  describe("GET methods", () => {
    it("Should redirect to the original url", async () => {
      const response = await request(app).get("/api/shorturl/0");

      expect(response.status).toBe(302);
      expect(response.headers.location).toEqual(urlToShort.url);
    });

    it("Should increment redirectCount", async () => {
      const response = await request(app).get("/api/shorturl/1");

      const response2 = await request(app).get(`/api/statistic/1`);

      expect(response2.body.redirectCount).toEqual(1);
    });
  });
});

describe("statistic route", () => {
  describe("GET methods", () => {
    it("Should return the statistics of all urls", async () => {
      const response1 = await request(app)
        .post("/api/shorturl/new")
        .send(urlToShort);

      const response2 = await request(app)
        .post("/api/shorturl/new")
        .send(urlToShort2);

      const response3 = await request(app).get(`/api/statistic`);

      const expectedResponse = {
        urls: [
          {
            originalUrl: urlToShort.url,
            creationDate: response3.body.urls[0].creationDate,
            shortUrlId: 0,
            redirectCount: 1,
          },
          {
            originalUrl: urlToShort2.url,
            creationDate: response3.body.urls[1].creationDate,
            shortUrlId: 1,
            redirectCount: 1,
          },
        ],
      };

      expect(response3.status).toBe(200);
      expect(response3.body).toEqual(expectedResponse);
    });

    it("Should should return the statistics of a specific url", async () => {
      const response1 = await request(app)
        .post("/api/shorturl/new")
        .send(urlToShort);

      const response2 = await request(app).get(
        `/api/statistic/${response1.body.short_url}`
      );

      const expectedResponse = {
        originalUrl: "https://www.reddit.com",
        creationDate: response2.body.creationDate,
        shortUrlId: 0,
        redirectCount: 1,
      };

      expect(response2.status).toBe(200);
      expect(response2.body).toEqual(expectedResponse);
    });

    it("Should return an error message with status code 404 for short url not found", async () => {
      const response = await request(app).get("/api/statistic/a");

      expect(response.status).toBe(404);
      expect(response.body).toEqual(urlNotFoundError);
    });
  });
});
