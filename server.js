require("dotenv").config();

const db = require("./config/connection");
const app = require("./app");

const PORT = process.env.PORT || 3001;

db.once("open", () => {
  app.listen(PORT, () => {
    console.log(`API server running on port ${PORT}!`);
  });
});
