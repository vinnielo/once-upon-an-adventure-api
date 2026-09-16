const express = require("express");
const cors = require("cors");
const routes = require("./routes");

const app = express();

app.use(cors({
  origin: [
    "http://localhost:3000",
    "https://once-upon-an-adventure-app.vercel.app"
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(routes);

app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && "body" in err) {
    return res.status(400).json({ error: { code: "INVALID_JSON", message: "Request body must be valid JSON" } });
  }

  return res.status(500).json({ error: { code: "INTERNAL_ERROR", message: "Internal server error" } });
});

module.exports = app;
