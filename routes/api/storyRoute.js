const router = require("express").Router();
const storyController = require("../../controllers/storyController");
const { requireAuth, requireUserAuth } = require("../../middleware/auth");

router.route("/:id").post(requireAuth, requireUserAuth, storyController.create);
router.route("/update/:id/:text").put(requireAuth, requireUserAuth, storyController.updateStory);

module.exports = router;
