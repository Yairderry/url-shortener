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

    database.findByOriginalUrlWithFile(url).then((theUrl) => {
      const newUrl = theUrl
        ? theUrl
        : database.addUrlToFile(url, new Date(), customUrl);
      console.log(newUrl);
      res.status(200).json({
        original_url: newUrl.originalUrl,
        short_url: newUrl.shortUrlId,
      });
    });
  }
);

shortUrl.get("/:id", urlCheck, (req, res) => {
  const { id } = req.params;

  database
    .findByShortUrlIdWithFile(id)
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
