const express = require("express");
const cors = require("cors");
const api = require("./api/api");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded());

app.use("/public", express.static(`${__dirname}/public`));

app.use("/api", api);
app.get("/", (req, res) => {
  res.sendFile(`${__dirname}/views/index.html`);
});

app.use("*", (req, res) => {
  res.json({ error: "This route does not exist!" });
});

module.exports = app;
