require("dotenv").config();
const axios = require("axios").default;
const UrlData = require("./UrlData");

const HEADERS = {
  "X-Master-Key": process.env.API_KEY,
  "Content-Type": "application/json",
  "X-Bin-Versioning": false,
};

class DataBase {
  constructor() {
    this.urls = [];
  }

  init(url) {
    axios
      .get(url, { headers: HEADERS })
      .then((res) => {
        res.data.record.body.urls.forEach(
          ({ originalUrl, redirectCount, shortUrlId, creationDate }) => {
            this.urls.push(
              new UrlData(originalUrl, creationDate, shortUrlId, redirectCount)
            );
          }
        );
      })
      .catch((err) => console.log(err));
  }

  backupToExternalService(url) {
    axios
      .put(url, { body: this }, { headers: HEADERS })
      .then((res) => {
        console.log(res);
      })
      .catch((err) => console.log(err));
  }

  addUrl(originalUrl, date = new Date(), shortUrlId = this.urls.length) {
    const url = new UrlData(
      originalUrl,
      DataBase.dateToSqlFormat(date),
      shortUrlId
    );
    this.urls.push(url);
    this.backupToExternalService(process.env.DB_URL);
    return url;
  }

  findByOriginalUrl(originalUrl) {
    const urlByOriginalUrl = this.urls.find(
      (url) => url.originalUrl === originalUrl
    );

    if (urlByOriginalUrl) return urlByOriginalUrl;
  }

  findByShortUrlId(shortUrlId) {
    const urlByShortUrlId = this.urls.find(
      (url) => url.shortUrlId === shortUrlId
    );

    if (urlByShortUrlId) return urlByShortUrlId;
  }

  get databaseLength() {
    return this.urls.length.toString();
  }

  static dateToSqlFormat = (givenDate = null) => {
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
}

const database = new DataBase();
database.init(process.env.DB_URL);

module.exports = database;
