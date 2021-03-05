require("dotenv").config();
const express = require("express");
const database = require("../DB/DataBase.js");
const statistic = express.Router();

statistic.use(express.json());
statistic.use(express.urlencoded());

statistic.get("/", (req, res) => {
  database
    .getAllUrls()
    .then((urls) => {
      res.status(200).json(urls);
    })
    .catch((err) => {
      res.status(500).send({ error: "There was an error with our servers" });
    });
});

statistic.get("/:id", (req, res) => {
  const { id } = req.params;

  database.findByShortUrlIdWithFile(id).then((url) => {
    const theUrl = url;
    if (!theUrl) {
      res.status(404).json({ error: "This short url was not found" });
    } else {
      res.status(200).json(theUrl);
    }
  });
});

module.exports = statistic;
