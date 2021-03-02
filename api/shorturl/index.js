require("dotenv").config();
const express = require("express");
const middleware = require("../../utils");

const shortend = [];
const shortUrl = express.Router();

shortUrl.use(express.json());
shortUrl.use(express.urlencoded());
shortUrl.use("/public", express.static(`./public`));

shortUrl.post("/red", function (req, res) {
  const { id } = req.body;
  res.writeHead(302, { Location: shortend[id] });
  res.end();
});

shortUrl.post("/new", middleware.urlCheck, function (req, res) {
  const { url } = req.body;
  if (!shortend.includes(url)) {
    shortend[shortend.length] = url;
    res.json({ original_url: url, short_url: shortend.length - 1 });
  } else {
    res.json({ original_url: url, short_url: shortend.indexOf(url) });
  }
});

module.exports = shortUrl;
