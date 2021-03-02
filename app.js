const express = require("express");
const cors = require("cors");
const api = require("./api");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded());

app.use("/public", express.static(`${__dirname}/public`));

app.use("/api", api);
app.get("/", (req, res) => {
  res.sendFile(`${__dirname}/views/index.html`);
});

module.exports = app;
