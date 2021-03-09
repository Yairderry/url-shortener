const request = require("supertest");
const app = require("./app.js");

const urlToShort = {
  url:
    "https://www.youtube.com/watch?v=AXhEGyURqXg&ab_channel=SucculentSessions",
  customUrl: "",
};

const urlToShort2 = {
  url: "https://www.youtube.com/watch?v=L0jQz6jqQS0&ab_channel=LastWeekTonight",
  customUrl: "",
};

const shortUrlToShort = { url: "https://github.com", customUrl: "" };

const customUrlToShort = {
  url: "https://www.youtube.com/watch?v=7VG_s2PCH_c&ab_channel=LastWeekTonight",
  customUrl: "F",
};
const invalidUrlToShort = { url: "reddit" };

const expectedUrlError = { error: "invalid url" };
const urlNotFoundError = { error: "This short url was not found" };
const customUrlTakenError = { error: "custom url already taken!" };
const urlAlreadyShortError = {
  error: "The url you sent is already shorter than we can provide",
};

describe("shorturl route", () => {
  describe("POST methods", () => {
    it("Should create a new short url successfully", async () => {
      const response = await request(app)
        .post("/api/shorturl/new")
        .send(urlToShort);

      const expectedResponse = {
        original_url: urlToShort.url,
        short_url: "0",
      };

      expect(response.status).toBe(200);
      expect(response.body).toEqual(expectedResponse);
    });

    it("Should not create a new short url when entering the same url", async () => {
      const response = await request(app)
        .post("/api/shorturl/new")
        .send(urlToShort);

      const expectedResponse = {
        original_url: urlToShort.url,
        short_url: "0",
      };

      expect(response.status).toBe(200);
      expect(response.body).toEqual(expectedResponse);
    });

    test("If second short url received === first short url received + 1", async () => {
      const response = await request(app)
        .post("/api/shorturl/new")
        .send(urlToShort2);

      const expectedResponse = {
        original_url: urlToShort2.url,
        short_url: "1",
      };

      expect(response.status).toBe(200);
      expect(response.body).toEqual(expectedResponse);
    });

    it("Should create a new custom short url", async () => {
      const response = await request(app)
        .post("/api/shorturl/new")
        .send(customUrlToShort);

      const expectedResponse = {
        original_url: customUrlToShort.url,
        short_url: "F",
      };

      expect(response.status).toBe(200);
      expect(response.body).toEqual(expectedResponse);
    });

    it("Should return an error message with status code 400 for custom short url taken", async () => {
      const response = await request(app)
        .post("/api/shorturl/new")
        .send(customUrlToShort);

      expect(response.status).toBe(400);
      expect(response.body).toEqual(customUrlTakenError);
    });

    it("Should return an error message with status code 400 for invalid url", async () => {
      const response = await request(app)
        .post("/api/shorturl/new")
        .send(invalidUrlToShort);

      expect(response.status).toBe(400);
      expect(response.body).toEqual(expectedUrlError);
    });

    it("Should return an error message with status code 400 for url already shorter than we can provide", async () => {
      const response = await request(app)
        .post("/api/shorturl/new")
        .send(shortUrlToShort);

      expect(response.status).toBe(400);
      expect(response.body).toEqual(urlAlreadyShortError);
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

      const response3 = await request(app)
        .post("/api/shorturl/new")
        .send(customUrlToShort);

      const response4 = await request(app).get(`/api/statistic`);

      const urls = response4.body;
      const expectedResponse = [
        {
          originalUrl: urlToShort.url,
          creationDate: urls[0].creationDate,
          shortUrlId: "0",
          redirectCount: 1,
        },
        {
          originalUrl: urlToShort2.url,
          creationDate: urls[1].creationDate,
          shortUrlId: "1",
          redirectCount: 1,
        },
        {
          originalUrl: customUrlToShort.url,
          creationDate: urls[2].creationDate,
          shortUrlId: "F",
          redirectCount: 0,
        },
      ];

      expect(response4.status).toBe(200);
      expect(urls).toEqual(expectedResponse);
    });

    it("Should should return the statistics of a specific url", async () => {
      const response1 = await request(app)
        .post("/api/shorturl/new")
        .send(urlToShort);

      const response2 = await request(app).get(
        `/api/statistic/${response1.body.short_url}`
      );

      const expectedResponse = {
        originalUrl: urlToShort.url,
        creationDate: response2.body.creationDate,
        shortUrlId: "0",
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
