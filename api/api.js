const { Router } = require("express");
const shortUrl = require("./shorturl.js");
const statistic = require("./statistic.js");

const api = Router();

api.use("/shorturl", shortUrl);
api.use("/statistic", statistic);

module.exports = api;
