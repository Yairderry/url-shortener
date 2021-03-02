const { Router } = require("express");

const statistic = Router();

statistic.use("*", (req, res) => {
  res.status(404).send({ message: "Bin not found" });
});

module.exports = statistic;
