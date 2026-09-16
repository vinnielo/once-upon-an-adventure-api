const router = require("express").Router();
const inventoryController = require("../../controllers/inventoryController");
const { requireAuth, requireUserAuth } = require("../../middleware/auth");

router.route("/:id").post(requireAuth, requireUserAuth, inventoryController.create);

module.exports = router;
