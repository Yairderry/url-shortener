require("dotenv").config();
const express = require("express");
const {
  validUrlCheck,
  urlCheck,
  customUrlCheck,
  isUrlShorterCheck,
} = require("../utils");
const database = require("../DB/DataBase.js");

const shortUrl = express.Router();

shortUrl.use(express.json());
shortUrl.use(express.urlencoded());
shortUrl.use("/public", express.static(`./public`));

shortUrl.post(
  "/new",
  validUrlCheck,
  isUrlShorterCheck,
  customUrlCheck,
  (req, res) => {
    const { url } = req.body;
    const customUrl =
      req.body.customUrl === "" ? database.totalUrls : req.body.customUrl;

    database.findByOriginalUrl(url).then((theUrl) => {
      if (theUrl) {
        res.status(200).json({
          original_url: theUrl.originalUrl,
          short_url: theUrl.shortUrlId,
        });
        return;
      }

      database.addUrl(url, new Date(), customUrl).then((addedUrl) => {
        res.status(200).json({
          original_url: addedUrl.originalUrl,
          short_url: addedUrl.shortUrlId,
        });
      });
    });
  }
);

shortUrl.get("/:shortUrlId", urlCheck, (req, res) => {
  const { shortUrlId } = req.params;

  database
    .findByShortUrlId(shortUrlId)
    .then((url) => {
      url.redirectCount++;
      database.updateUrlData(url).then((response) => {
        res.writeHead(302, { Location: url.originalUrl });
        res.end();
      });
    })
    .catch((err) => {
      res.status(500).send({ error: "There was an error with our servers" });
    });
});

module.exports = shortUrl;
