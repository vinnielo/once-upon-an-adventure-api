const db = require("../models");

function sendError(res, status, code, message) {
  return res.status(status).json({ error: { code, message } });
}

async function deleteSprite(sprite) {
  if (!sprite) return;
  try {
    await db.Sprite.deleteOne({ _id: sprite._id });
  } catch (error) {
    // Preserve the association error when compensating cleanup also fails.
  }
}

const validators = {
  money: (value) => Number.isFinite(Number(value)) ? Number(value) : null,
  lives: (value) => Number.isInteger(Number(value)) && Number(value) >= 0 ? Number(value) : null,
  place: (value) => typeof value === "string" && value.trim() ? value.trim() : null,
  position: (value) => Array.isArray(value) && value.length === 2 && value.every((coordinate) => Number.isInteger(coordinate) && coordinate >= 0) ? value : null
};

async function updateSpriteState(req, res, field, rawValue) {
  const value = validators[field] ? validators[field](rawValue) : rawValue;
  if (value === null) {
    const message = field === "place" ? "place must be a non-empty string" : field === "position" ? "position must contain two non-negative integers" : `${field} must be a number`;
    return sendError(res, 400, "INVALID_STATE", message);
  }

  try {
    const user = await db.User.findById(req.params.id);
    const spriteId = user && Array.isArray(user.sprite) ? user.sprite[0] : user && user.sprite;
    if (!spriteId) return sendError(res, 404, "SPRITE_NOT_FOUND", "Sprite not found for user");

    const sprite = await db.Sprite.findOneAndUpdate(
      { _id: spriteId },
      { $set: { [field]: value } },
      { new: true, runValidators: true }
    );
    if (!sprite) return sendError(res, 404, "SPRITE_NOT_FOUND", "Sprite not found for user");
    return res.json(sprite);
  } catch (error) {
    return sendError(res, 422, "SPRITE_UPDATE_FAILED", "Unable to update sprite state");
  }
}

module.exports = {
  async findAll(req, res) {
    try {
      return res.json(await db.Sprite.find(req.query));
    } catch (error) {
      return sendError(res, 422, "SPRITE_QUERY_FAILED", "Unable to retrieve sprites");
    }
  },

  async create(req, res) {
    if (!req.params.id) return sendError(res, 400, "USER_ID_REQUIRED", "User id is required");
    let sprite;
    try {
      const existingUser = await db.User.findById(req.params.id);
      if (!existingUser) return sendError(res, 404, "USER_NOT_FOUND", "User not found");
      sprite = await db.Sprite.create(req.body);
      const user = await db.User.findOneAndUpdate(
        { _id: req.params.id },
        { $set: { sprite: sprite._id } },
        { new: true, runValidators: true }
      );
      if (!user) {
        await deleteSprite(sprite);
        return sendError(res, 404, "USER_NOT_FOUND", "User not found");
      }
      return res.status(201).json(user);
    } catch (error) {
      await deleteSprite(sprite);
      return sendError(res, 422, "SPRITE_CREATE_FAILED", "Unable to create sprite");
    }
  },

  async findSprite(req, res) {
    try {
      return res.json(await db.Sprite.find({ sprite: req.body.sprite }));
    } catch (error) {
      return sendError(res, 422, "SPRITE_QUERY_FAILED", "Unable to retrieve sprite");
    }
  },

  updateMoney(req, res) { return updateSpriteState(req, res, "money", req.params.money); },
  updateHomeFirst(req, res) { return updateSpriteState(req, res, "homeFirst", false); },
  updateGuardTalk(req, res) { return updateSpriteState(req, res, "apiFirstGuardTalk", false); },
  updateOrcTalk(req, res) { return updateSpriteState(req, res, "apiFirstOrcTalk", false); },
  updateJaceTalk(req, res) { return updateSpriteState(req, res, "apiFirstJaceTalk", false); },
  updateThiefTalk(req, res) { return updateSpriteState(req, res, "apiFirstThiefTalk", false); },
  updatePermit(req, res) { return updateSpriteState(req, res, "permit", true); },
  updatePlace(req, res) { return updateSpriteState(req, res, "place", req.params.place); },
  updatePosition(req, res) { return updateSpriteState(req, res, "position", req.body && req.body.position); },
  updateLives(req, res) { return updateSpriteState(req, res, "lives", req.params.lives); }
};
