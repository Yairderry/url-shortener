require("dotenv").config();
const express = require("express");
const {
  validUrlCheck,
  urlCheck,
  customUrlCheck,
  isUrlShorterCheck,
} = require("./utils");
const shortUrl = express.Router();

shortUrl.use(express.json());
shortUrl.use(express.urlencoded());
shortUrl.use("/public", express.static(`./public`));

shortUrl.post(
  "/new",
  validUrlCheck,
  isUrlShorterCheck,
  customUrlCheck,
  async (req, res) => {
    try {
      const { url } = req.body;
      const customUrl =
        req.body.customUrl === "" ? req.database.totalUrls : req.body.customUrl;

      let urlData;
      urlData = await req.database.findByOriginalUrl(url);
      if (!urlData) {
        urlData = await req.database.addUrl(url, new Date(), customUrl);
      }

      res.status(200).json({
        original_url: urlData.originalUrl,
        short_url: urlData.shortUrlId,
      });
    } catch (e) {
      res
        .status(500)
        .json({ error: "The server couldn't add the url to the database" });
    }
  }
);

shortUrl.get("/:shortUrlId", urlCheck, async (req, res) => {
  try {
    const { shortUrlId } = req.params;
    const url = await req.database.findByShortUrlId(shortUrlId);

    url.redirectCount++;
    await req.database.updateUrlData(url);
    res.writeHead(302, { Location: url.originalUrl });
    res.end();
  } catch {
    res
      .status(500)
      .send({ error: "There server couldn't update the redirect count" });
  }
});

module.exports = shortUrl;
