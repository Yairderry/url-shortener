require("dotenv").config();
const express = require("express");
const axios = require("axios").default;
const { urlCheck, dateToSqlFormat } = require("../../utils");

class DataBase {
  constructor() {
    this.urls = [];
  }

  getData(url) {
    axios.get(url).then((res) => {
      res.data.record.urls.forEach(
        ({ originalUrl, redirectCount, shortUrlId, creationDate }) => {
          console.log({ originalUrl, redirectCount, shortUrlId, creationDate });
          this.urls.push(
            new Url(originalUrl, creationDate, shortUrlId, redirectCount)
          );
        }
      );
    });
  }

  setData(url) {
    axios.put(url, this).then((res) => {
      console.log(res);
    });
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
    this.shortUrlId = shortUrlId;
    this.redirectCount = redirectCount;
  }
}

/*------------------------------------------------------------------*/
const database = new DataBase();
database.getData(process.env.DB_URL);

const statistic = express.Router();

statistic.use(express.json());
statistic.use(express.urlencoded());
statistic.use("/public", express.static(`./public`));

statistic.get("/", (req, res) => {
  res.status(200).json(database);
});

statistic.get("/:id", (req, res) => {
  const { id } = req.params;

  const url = database.findUrl(null, id);
  if (!url) {
    res.status(404).json({ error: "This short url was not found" });
  } else {
    res.status(200).json(url);
  }
});

module.exports = statistic;
