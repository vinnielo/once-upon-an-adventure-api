// const express = require("express");
// const path = require("path");
// const mongoose = require("mongoose");
// const routes = require("./routes");

// const app = express();
// const PORT = process.env.PORT || 3001;

// // Define middleware here
// app.use(express.urlencoded({ extended: true }));
// app.use(express.json());
// // Serve up static assets (usually on heroku)

// if (process.env.NODE_ENV === "production") {
//   app.use(express.static(path.join(__dirname, "build")));

//   // app.get("*", (req, res) => {
//   //   res.sendFile(path.join(__dirname, "../client/build/index.html"));
//   // });
// }
// // Add routes, both API and view
// app.use(routes);

// // Connect to the Mongo DB
// mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/reactrpgX");

// // Start the API server
// app.listen(PORT, function () {
//   console.log(`🌎  ==> API Server now listening on PORT ${PORT}!`);
// });

const express = require("express");
const db = require("./config/connection");
const routes = require("./routes");
const cors = require("cors");

const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(routes);

app.use(cors());

db.once("open", () => {
  app.listen(PORT, () => {
    console.log(`API server running on port ${PORT}!`);
  });
});
