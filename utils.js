const urlCheck = (req, res, next) => {
  const { url } = req.body;

  const validUrlRegex = /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/;

  if (!validUrlRegex.test(url)) {
    res.status(400).send({ error: "invalid url" });
  } else {
    next();
  }
};

module.exports = { urlCheck };
