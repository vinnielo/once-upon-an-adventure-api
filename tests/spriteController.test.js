jest.mock("../models", () => ({
  User: { findById: jest.fn(), findOneAndUpdate: jest.fn() },
  Sprite: { create: jest.fn(), findOneAndUpdate: jest.fn(), deleteOne: jest.fn() }
}));

const db = require("../models");
const controller = require("../controllers/spriteController");
const response = () => ({ status: jest.fn().mockReturnThis(), json: jest.fn() });

describe("sprite state updates", () => {
  beforeEach(() => jest.clearAllMocks());

  test("updates money atomically with validation", async () => {
    db.User.findById.mockResolvedValue({ sprite: "sprite-1" });
    db.Sprite.findOneAndUpdate.mockResolvedValue({ _id: "sprite-1", money: 25 });
    const res = response();

    await controller.updateMoney({ params: { id: "user-1", money: "25" } }, res);

    expect(db.Sprite.findOneAndUpdate).toHaveBeenCalledWith(
      { _id: "sprite-1" },
      { $set: { money: 25 } },
      { new: true, runValidators: true }
    );
    expect(res.json).toHaveBeenCalledWith({ _id: "sprite-1", money: 25 });
  });

  test("rejects a non-numeric money update before database access", async () => {
    const res = response();

    await controller.updateMoney({ params: { id: "user-1", money: "not-a-number" } }, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: { code: "INVALID_STATE", message: "money must be a number" } });
    expect(db.User.findById).not.toHaveBeenCalled();
  });

  test("returns JSON not found when the user has no sprite", async () => {
    db.User.findById.mockResolvedValue(null);
    const res = response();

    await controller.updateLives({ params: { id: "user-1", lives: "2" } }, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: { code: "SPRITE_NOT_FOUND", message: "Sprite not found for user" } });
  });

  test("does not create a sprite when the user does not exist", async () => {
    db.User.findById.mockResolvedValue(null);
    const res = response();

    await controller.create({ params: { id: "user-1" }, body: { place: "Home" } }, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: { code: "USER_NOT_FOUND", message: "User not found" } });
    expect(db.Sprite.create).not.toHaveBeenCalled();
  });

  test("deletes a created sprite when user association returns null", async () => {
    db.User.findById.mockResolvedValue({ _id: "user-1" });
    db.Sprite.create.mockResolvedValue({ _id: "sprite-1" });
    db.User.findOneAndUpdate.mockResolvedValue(null);
    db.Sprite.deleteOne.mockResolvedValue({ deletedCount: 1 });
    const res = response();

    await controller.create({ params: { id: "user-1" }, body: { place: "Home" } }, res);

    expect(db.Sprite.deleteOne).toHaveBeenCalledWith({ _id: "sprite-1" });
    expect(res.status).toHaveBeenCalledWith(404);
  });

  test("deletes a created sprite when user association fails", async () => {
    db.User.findById.mockResolvedValue({ _id: "user-1" });
    db.Sprite.create.mockResolvedValue({ _id: "sprite-1" });
    db.User.findOneAndUpdate.mockRejectedValue(new Error("write failed"));
    db.Sprite.deleteOne.mockResolvedValue({ deletedCount: 1 });
    const res = response();

    await controller.create({ params: { id: "user-1" }, body: { place: "Home" } }, res);

    expect(db.Sprite.deleteOne).toHaveBeenCalledWith({ _id: "sprite-1" });
    expect(res.status).toHaveBeenCalledWith(422);
  });
});
