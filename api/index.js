const { Router } = require("express");
const shortUrl = require("./shortUrl");
// const statistic = require("./statistic");

const api = Router();

api.use("/shorturl", shortUrl);
// api.use("/statistic", statistic);

module.exports = api;
