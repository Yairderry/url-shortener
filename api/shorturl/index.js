require("dotenv").config();
const express = require("express");
const middleware = require("../../utils");

class DataBase {
  constructor() {
    this.urls = [];
  }

  addUrl(originalUrl, shortUrlId = this.urls.length) {
    const url = new Url(new Date(), originalUrl, shortUrlId);
    this.urls.push(url);
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
  constructor(creationDate, originalUrl, shortUrlId) {
    this.creationDate = creationDate;
    this.redirectCount = 0;
    this.originalUrl = originalUrl;
    this.shortUrlId = shortUrlId;
  }
}

const shortend = new DataBase();
const shortUrl = express.Router();

shortUrl.use(express.json());
shortUrl.use(express.urlencoded());
shortUrl.use("/public", express.static(`./public`));

shortUrl.post("/new", middleware.urlCheck, function (req, res) {
  const { url } = req.body;
  const theUrl = shortend.findUrl(url);
  if (!theUrl) {
    shortend.addUrl(url);
    const newUrl = shortend.findUrl(url);
    res.json({
      original_url: newUrl.originalUrl,
      short_url: newUrl.shortUrlId,
    });
  } else {
    res.json({
      original_url: theUrl.originalUrl,
      short_url: theUrl.shortUrlId,
    });
  }
});

shortUrl.post("/red", function (req, res) {
  const { id } = req.body;
  console.log(shortend.urls);

  const url = shortend.findUrl(null, id);
  res.writeHead(302, { Location: url.originalUrl });
  res.end();
});

module.exports = shortUrl;
