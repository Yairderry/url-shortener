require("dotenv").config();
const axios = require("axios").default;
const { dateToSqlFormat } = require("./utils");

const headers = {
  "X-Master-Key": process.env.API_KEY,
  "Content-Type": "application/json",
  "X-Bin-Versioning": false,
};

class DataBase {
  constructor() {
    this.urls = [];
  }

  getData(url) {
    axios
      .get(url, { headers })
      .then((res) => {
        res.data.record.body.urls.forEach(
          ({ originalUrl, redirectCount, shortUrlId, creationDate }) => {
            this.urls.push(
              new Url(originalUrl, creationDate, shortUrlId, redirectCount)
            );
          }
        );
      })
      .catch((err) => console.log(err));
  }

  setData(url) {
    axios
      .put(url, { body: this }, { headers })
      .then((res) => {
        console.log(res);
      })
      .catch((err) => console.log(err));
  }

  addUrl(
    originalUrl,
    date = new Date(),
    shortUrlId = this.urls.length,
    redirectCount = 0
  ) {
    const url = new Url(
      originalUrl,
      dateToSqlFormat(date),
      shortUrlId,
      redirectCount
    );
    this.urls.push(url);
    this.setData(process.env.DB_URL);
  }

  findUrl(originalUrl, shortUrlId) {
    const urlByOriginalUrl = this.urls.filter(
      (url) => url.originalUrl === originalUrl
    )[0];
    const urlByShortUrlId = this.urls.filter(
      (url) => url.shortUrlId.toString() === shortUrlId
    )[0];

    if (urlByOriginalUrl) return urlByOriginalUrl;
    if (urlByShortUrlId) return urlByShortUrlId;
  }
}

class Url {
  constructor(originalUrl, creationDate, shortUrlId, redirectCount = 0) {
    this.originalUrl = originalUrl;
    this.creationDate = creationDate;
    this.shortUrlId = shortUrlId.toString();
    this.redirectCount = redirectCount;
  }
}

const database = new DataBase();
database.getData(process.env.DB_URL);

module.exports = database;
