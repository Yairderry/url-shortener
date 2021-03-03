require("dotenv").config();
const express = require("express");
const database = require("../../classes.js");
const { validUrlCheck, urlCheck, customUrlCheck } = require("../../utils");

const shortUrl = express.Router();

shortUrl.use(express.json());
shortUrl.use(express.urlencoded());
shortUrl.use("/public", express.static(`./public`));

shortUrl.post("/new", validUrlCheck, customUrlCheck, (req, res) => {
  const { url } = req.body;
  const customUrl = req.body.customUrl === "" ? undefined : req.body.customUrl;

  const theUrl = database.findUrl(url);

  if (!theUrl) {
    database.addUrl(url, new Date(), customUrl);
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

shortUrl.get("/:id", urlCheck, (req, res) => {
  const { id } = req.params;

  const url = database.findUrl(null, id);

  url.redirectCount++;

  try {
    database.setData(process.env.DB_URL);
  } catch (e) {
    res.status(500).send({ error: "There was an error with our servers" });
  }
  res.writeHead(302, { Location: url.originalUrl });
  res.end();
});

module.exports = shortUrl;
