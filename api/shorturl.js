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
      req.body.customUrl === "" ? undefined : req.body.customUrl;

    const theUrl = database.findByOriginalUrl(url);

    try {
      const newUrl = theUrl
        ? theUrl
        : database.addUrl(url, new Date(), customUrl);
      res.status(200).json({
        original_url: newUrl.originalUrl,
        short_url: newUrl.shortUrlId,
      });
    } catch (e) {
      res.status(500).send({ error: "There was an error with our servers" });
    }
  }
);

shortUrl.get("/:id", urlCheck, (req, res) => {
  const { id } = req.params;

  const url = database.findByShortUrlId(id);

  url.redirectCount++;

  try {
    database.backupToExternalService(process.env.DB_URL);
  } catch (e) {
    res.status(500).send({ error: "There was an error with our servers" });
  }
  res.writeHead(302, { Location: url.originalUrl });
  res.end();
});

module.exports = shortUrl;
