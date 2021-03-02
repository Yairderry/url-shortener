const urlCheck = (req, res, next) => {
  const { url } = req.body;

  const validUrlRegex = /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/;

  if (!validUrlRegex.test(url)) {
    res.status(400).send({ error: "invalid url" });
  } else {
    next();
  }
};

const dateToSqlFormat = (givenDate = null) => {
  const date = givenDate ? new Date(givenDate) : new Date();

  const sec = date.getSeconds().toString();
  const s = sec.length === 2 ? sec : `0${sec}`;

  const min = date.getMinutes().toString();
  const m = min.length === 2 ? min : `0${min}`;

  const hour = date.getHours().toString();
  const h = hour.length === 2 ? hour : `0${hour}`;

  const month = (date.getMonth() + 1).toString();
  const M = month.length === 2 ? month : `0${month}`;

  const day = date.getDate().toString();
  const d = day.length === 2 ? day : `0${day}`;

  return `${date.getFullYear()}-${M}-${d} ${h}:${m}:${s}`;
};

module.exports = { urlCheck, dateToSqlFormat };
