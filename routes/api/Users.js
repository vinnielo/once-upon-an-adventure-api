const router = require("express").Router();
const {
  findAll,
  create,
  findUserAvatar,
  findUserStory,
  findUserInventory,
  findUser
} = require("../../controllers/dataController");

// Matches with "/api/signup"
router.route("/")
  .get(findAll)
  .post(create);
 
  router.route("/login")
  .post(findUser)

  router.route("/avatar/:id?")
  .get(findUserAvatar);

  router.route("/avatar/story/:id?")
  .get(findUserStory);

  router.route("/inventory/:id?")
  .get(findUserInventory)

  module.exports = router;