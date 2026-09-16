const router = require("express").Router();
const apiRoutes = require("./api");

router.use("/api", apiRoutes);

router.use((req, res) => {
  return res.status(404).json({ error: { code: "NOT_FOUND", message: "Route not found" } });
});

module.exports = router;
