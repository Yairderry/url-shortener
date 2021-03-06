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
  constructor(path, backupPath, totalUrls = 0) {
    this.filePath = path;
    this.backupPath = backupPath;
    this.totalUrls = totalUrls;
  }

  init() {
    fsPromise
      .readFile(this.filePath)
      .then((res) => {
        const data = JSON.parse(res);
        this.totalUrls = data.length;
      })
      .catch((err) => {
        axios
          .get(this.backupPath, { headers: HEADERS })
          .then((res) => {
            this.totalUrls = res.data.record.body.length;
          })
          .catch((err) => console.log(err));
      });
  }

  updateData(data) {
    fsPromise
      .writeFile(this.filePath, JSON.stringify(data, null, 4))
      .then((res) => console.log(res))
      .catch((err) => {
        return axios
          .put(this.backupPath, { body: data }, { headers: HEADERS })
          .then((res) => console.log(res))
          .catch((err) => console.log(err));
      });

    axios
      .put(this.backupPath, { body: data }, { headers: HEADERS })
      .then((res) => console.log(res))
      .catch((err) => console.log(err));
  }

  getAllUrls() {
    return fsPromise
      .readFile(this.filePath, { encoding: "utf-8", flag: "r" })
      .then((data) => {
        const urls = data === "" ? [] : JSON.parse(data);
        return urls;
      });
  }

  findByShortUrlId(shortUrlId) {
    return this.getAllUrls().then((urls) => {
      const urlByShortUrlId = urls.find((url) => url.shortUrlId === shortUrlId);

      if (urlByShortUrlId) return urlByShortUrlId;
    });
  }

  findByOriginalUrl(originalUrl) {
    return this.getAllUrls().then((urls) => {
      const urlByOriginalUrl = urls.find(
        (url) => url.originalUrl === originalUrl
      );

      if (urlByOriginalUrl) return urlByOriginalUrl;
    });
  }

  updateUrlData(newUrl) {
    return this.getAllUrls().then((urls) => {
      const urlByShortUrlId = urls.find(
        (url) => url.shortUrlId === newUrl.shortUrlId
      );

      if (urlByShortUrlId) {
        for (let prop in urlByShortUrlId) {
          urlByShortUrlId[prop] = newUrl[prop];
        }
      }

      this.updateData(urls);
    });
  }

  addUrl(originalUrl, date = new Date(), shortUrlId = this.urls) {
    const url = new UrlData(
      originalUrl,
      DataBase.dateToSqlFormat(date),
      shortUrlId
    );

    return this.getAllUrls().then((urls) => {
      urls.push(url);
      this.totalUrls++;
      this.updateData(urls);
      return url;
    });
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

const database = new DataBase("./DB/UrlsDB.JSON", process.env.DB_URL);
database.init();
module.exports = database;
