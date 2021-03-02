const { Router } = require("express");
const statistic = require("./stat");

const stat = Router();

stat.use("/statistic", statistic);
// stat.use("*", (req, res) => {
//   res.status(404).send({ message: "Bin not found" });
// });

module.exports = stat;
