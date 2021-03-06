require("dotenv").config();
const express = require("express");
const database = require("../DB/DataBase.js");

const statistic = express.Router();

statistic.use(express.json());
statistic.use(express.urlencoded());

statistic.get("/", async (req, res) => {
  try {
    const urls = await database.getAllUrls();
    res.status(200).json(urls);
  } catch (err) {
    res
      .status(500)
      .send({ error: "The server couldn't get the all urls statistics" });
  }
});

statistic.get("/:shortUrlId", async (req, res) => {
  try {
    const { shortUrlId } = req.params;
    const url = await database.findByShortUrlId(shortUrlId);
    if (!url) {
      res.status(404).json({ error: "This short url was not found" });
    } else {
      res.status(200).json(url);
    }
  } catch (err) {
    res
      .status(500)
      .send({ error: "The server couldn't get the url's statistics" });
  }
});

module.exports = statistic;
