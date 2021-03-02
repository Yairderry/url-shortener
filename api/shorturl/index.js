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

const shortUrl = express.Router();

shortUrl.use(express.json());
shortUrl.use(express.urlencoded());
shortUrl.use("/public", express.static(`./public`));

shortUrl.post("/new", urlCheck, function (req, res) {
  const { url } = req.body;
  console.log(req.body);
  const theUrl = database.findUrl(url);

  if (!theUrl) {
    database.addUrl(url);
    const newUrl = database.findUrl(url);
    res.status(200).json({
      original_url: newUrl.originalUrl,
      short_url: newUrl.shortUrlId,
    });
  } else {
    res.status(200).json({
      original_url: theUrl.originalUrl,
      short_url: theUrl.shortUrlId,
    });
  }
});

shortUrl.post("/red", function (req, res) {
  const { id } = req.body;

  const url = database.findUrl(null, id);
  console.log(database);
  url.redirectCount++;
  res.writeHead(302, { Location: url.originalUrl });
  res.end();
});

module.exports = shortUrl;
