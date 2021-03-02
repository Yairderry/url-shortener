require("dotenv").config();
const express = require("express");
const DataBase = require("../../classes.js");
const { urlCheck } = require("../../utils");

/*------------------------------------------------------------------*/
const database = new DataBase();
database.getData(process.env.DB_URL);

const shortUrl = express.Router();

shortUrl.use(express.json());
shortUrl.use(express.urlencoded());
shortUrl.use("/public", express.static(`./public`));

shortUrl.post("/new", urlCheck, (req, res) => {
  const { url } = req.body;
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

shortUrl.get("/:id", (req, res) => {
  const { id } = req.params;

  const url = database.findUrl(null, id);
  url.redirectCount++;
  database.setData(process.env.DB_URL);
  res.writeHead(302, { Location: url.originalUrl });
  res.end();
});

shortUrl.post("/red", (req, res) => {
  const { id } = req.body;

  const url = database.findUrl(null, id);
  url.redirectCount++;
  database.setData(process.env.DB_URL);

  res.writeHead(302, { Location: url.originalUrl });
  res.end();
});

module.exports = shortUrl;
