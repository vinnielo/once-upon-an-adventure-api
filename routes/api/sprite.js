const router = require("express").Router();
const spriteController = require("../../controllers/spriteController");
const { requireAuth, requireUserAuth } = require("../../middleware/auth");

router.route("/:id").post(requireAuth, requireUserAuth, spriteController.create);
router.route("/homefirst/:id").put(requireAuth, requireUserAuth, spriteController.updateHomeFirst);
router.route("/guardTalk/:id").put(requireAuth, requireUserAuth, spriteController.updateGuardTalk);
router.route("/orcTalk/:id").put(requireAuth, requireUserAuth, spriteController.updateOrcTalk);
router.route("/jaceTalk/:id").put(requireAuth, requireUserAuth, spriteController.updateJaceTalk);
router.route("/thiefTalk/:id").put(requireAuth, requireUserAuth, spriteController.updateThiefTalk);
router.route("/permit/:id").put(requireAuth, requireUserAuth, spriteController.updatePermit);
router.route("/place/:id/:place").put(requireAuth, requireUserAuth, spriteController.updatePlace);
if (spriteController.updatePosition) {
    router.route("/position/:id").put(requireAuth, requireUserAuth, spriteController.updatePosition);
}
router.route("/money/:id/:money").put(requireAuth, requireUserAuth, spriteController.updateMoney);
router.route("/lives/:id/:lives").put(requireAuth, requireUserAuth, spriteController.updateLives);

module.exports = router;
