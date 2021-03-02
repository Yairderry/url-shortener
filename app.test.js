const request = require("supertest");
const app = require("./app.js");

const expectedUrlError = { error: "invalid url" };
const expectedBinError = { error: "This short url was not found" };
const expectedServersError = { error: "There was an error with our servers" };

describe("POST method", () => {
  const urlToShort = { url: "https://www.reddit.com" };
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

  it("Should return an error message with status code 400 for invalid url", async () => {
    const response = await request(app)
      .post("/api/shorturl/new")
      .send(invalidUrlToShort);

    expect(response.status).toBe(400);
    expect(response.body).toEqual(expectedUrlError);
  });
});
