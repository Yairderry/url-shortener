class UrlData {
  constructor(originalUrl, creationDate, shortUrlId, redirectCount = 0) {
    this.originalUrl = originalUrl;
    this.creationDate = creationDate;
    this.shortUrlId = shortUrlId.toString();
    this.redirectCount = redirectCount;
  }
}

module.exports = UrlData;
