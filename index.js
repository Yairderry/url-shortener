require("dotenv").config();

const PORT = process.env.PORT || 3000;

const app = require("./app");

app.listen(PORT, () => {
  // todo: app is listening on - origin
  console.log(`app listening on port: ${PORT}`);
});
