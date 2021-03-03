require("dotenv").config();
const axios = require("axios").default;

const headers = {
  "X-Master-Key": process.env.API_KEY,
  "Content-Type": "application/json",
  "X-Bin-Versioning": false,
};

const dateToSqlFormat = (givenDate = null) => {
  const date = givenDate ? new Date(givenDate) : new Date();

  const sec = date.getSeconds().toString();
  const s = sec.length === 2 ? sec : `0${sec}`;

  const min = date.getMinutes().toString();
  const m = min.length === 2 ? min : `0${min}`;

  const hour = date.getHours().toString();
  const h = hour.length === 2 ? hour : `0${hour}`;

  const month = (date.getMonth() + 1).toString();
  const M = month.length === 2 ? month : `0${month}`;

  const day = date.getDate().toString();
  const d = day.length === 2 ? day : `0${day}`;

  return `${date.getFullYear()}-${M}-${d} ${h}:${m}:${s}`;
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
    return url;
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
