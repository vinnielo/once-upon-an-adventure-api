const router = require("express").Router();
const { requireAuth, requireUserAuth } = require("../../middleware/auth");
const {
  create,
  findUser,
  findUserStory,
  findUserInventory,
  login
} = require("../../controllers/dataController");

router.route("/").post(create);
router.route("/login").post(login);
router.route("/avatar/story/:id").get(requireAuth, requireUserAuth, findUserStory);
router.route("/inventory/:id").get(requireAuth, requireUserAuth, findUserInventory);
router.route("/:id").get(requireAuth, requireUserAuth, findUser);

module.exports = router;
