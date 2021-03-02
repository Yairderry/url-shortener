require("dotenv").config();
const express = require("express");
const cors = require("cors");
const middleware = require("./utils");
const app = express();

const shortend = [];

app.use(cors());
app.use(express.json());
app.use(express.urlencoded());
app.use("/public", express.static(`./public`));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});

app.post("/api/shorturl/red", function (req, res) {
  const { id } = req.body;
  res.writeHead(302, { Location: shortend[id] });
  res.end();
});

app.post("/api/shorturl/new", middleware.urlCheck, function (req, res) {
  const { url } = req.body;
  if (!shortend.includes(url)) {
    shortend[shortend.length] = url;
    res.json({ original_url: url, short_url: shortend.length - 1 });
  } else {
    res.json({ original_url: url, short_url: shortend.indexOf(url) });
  }
});

module.exports = app;
