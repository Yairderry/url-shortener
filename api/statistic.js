require("dotenv").config();
const express = require("express");
const database = require("../DB/DataBase.js");
const statistic = express.Router();

statistic.use(express.json());
statistic.use(express.urlencoded());

statistic.get("/", (req, res) => {
  res.status(200).json(database);
});

statistic.get("/:id", (req, res) => {
  const { id } = req.params;

  const url = database.findUrl(null, id);
  if (!url) {
    res.status(404).json({ error: "This short url was not found" });
  } else {
    res.status(200).json(url);
  }
});

module.exports = statistic;
