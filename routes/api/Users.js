const router = require("express").Router();
const {
  findAll,
  create,
  findUser,
  findUserStory,
  findUserInventory,
  login,
} = require("../../controllers/dataController");


router.route("/").get(findAll).post(create);

router.route("/login").post(login);

router.route("/:id").get(findUser);

router.route("/avatar/story/:id?").get(findUserStory);

router.route("/inventory/:id?").get(findUserInventory);

module.exports = router;
