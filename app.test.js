const request = require("supertest");
const app = require("./app.js");

const expectedUrlError = { error: "invalid url" };
const expectedBinError = { error: "This short url was not found" };
const expectedServersError = { error: "There was an error with our servers" };

describe("POST method", () => {
  const urlToShort = { url: "https://www.reddit.com" };
  const urlToShort2 = { url: "https://www.google.com" };
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
