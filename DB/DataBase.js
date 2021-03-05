require("dotenv").config();
const axios = require("axios").default;
const fsPromise = require("fs/promises");
const UrlData = require("./UrlData");

const HEADERS = {
  "X-Master-Key": process.env.API_KEY,
  "Content-Type": "application/json",
  "X-Bin-Versioning": false,
};

class DataBase {
  constructor(path, backupPath) {
    this.filePath = path;
    this.backupPath = backupPath;
    this.urls = [];
  }
  init() {
    fsPromise
      .readFile(this.filePath)
      .then((res) => {
        const data = JSON.parse(res);
        data.urls.forEach(
          ({ originalUrl, redirectCount, shortUrlId, creationDate }) => {
            this.urls.push(
              new UrlData(originalUrl, creationDate, shortUrlId, redirectCount)
            );
          }
        );
      })
      .catch((err) => {
        axios
          .get(this.backupPath, { headers: HEADERS })
          .then((res) => {
            res.data.record.body.urls.forEach(
              ({ originalUrl, redirectCount, shortUrlId, creationDate }) => {
                this.urls.push(
                  new UrlData(
                    originalUrl,
                    creationDate,
                    shortUrlId,
                    redirectCount
                  )
                );
              }
            );
          })
          .catch((err) => console.log(err));
      });
  }

  updateData() {
    fsPromise
      .writeFile(this.filePath, JSON.stringify(this, null, 4))
      .then((res) => console.log(res))
      .catch((err) => {
        return axios
          .put(this.backupPath, { body: this }, { headers: HEADERS })
          .then((res) => console.log(res))
          .catch((err) => console.log(err));
      });
    axios
      .put(this.backupPath, { body: this }, { headers: HEADERS })
      .then((res) => console.log(res))
      .catch((err) => console.log(err));
  }

  addUrl(originalUrl, date = new Date(), shortUrlId = this.urls.length) {
    const url = new UrlData(
      originalUrl,
      DataBase.dateToSqlFormat(date),
      shortUrlId
    );
    this.urls.push(url);
    // this.backupToExternalService(process.env.DB_URL);
    this.updateData("./DB/DataBase.JSON");
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

const database = new DataBase("./DB/DataBase.JSON", process.env.DB_URL);
database.init();
module.exports = database;
