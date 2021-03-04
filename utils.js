const shortUrl = require("./api/shorturl.js");
const database = require("./DB/DataBase.js");

const validUrlCheck = (req, res, next) => {
  const { url } = req.body;

  const validUrlRegex = /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/;

  if (!validUrlRegex.test(url)) {
    res.status(400).json({ error: "invalid url" });
  } else {
    next();
    return;
  }
};

const urlCheck = (req, res, next) => {
  const { id } = req.params;

  const url = database.findByShortUrlId(id);
  if (!url) {
    res.status(404).json({ error: "This short url was not found" });
  } else {
    next();
    return;
  }
};

const customUrlCheck = (req, res, next) => {
  const customUrl = req.body.customUrl === "" ? undefined : req.body.customUrl;

  if (customUrl === undefined) {
    next();
    return;
  }

  const theCustomUrl = database.findByShortUrlId(customUrl);

  if (theCustomUrl) {
    res.status(400).send({ error: "custom url already taken!" });
    return;
  }
  next();
};

const isUrlShorterCheck = (req, res, next) => {
  const customUrl =
    req.body.customUrl === "" ? database.databaseLength : req.body.customUrl;
  const origin = req.headers.referer
    ? req.headers.referer
    : `http://localhost:${process.env.PORT}/`;
  const shortUrl = origin + customUrl;

  if (shortUrl.length >= req.body.url.length) {
    res.status(400).send({
      error: "The url you sent is already shorter than we can provide",
    });
    return;
  }
  next();
};

module.exports = { validUrlCheck, urlCheck, customUrlCheck, isUrlShorterCheck };
