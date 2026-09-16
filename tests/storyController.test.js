jest.mock("../models", () => ({
  Story: { create: jest.fn(), deleteOne: jest.fn() },
  User: { findById: jest.fn(), findOneAndUpdate: jest.fn() }
}));

const db = require("../models");
const controller = require("../controllers/storyController");
const response = () => ({ status: jest.fn().mockReturnThis(), json: jest.fn() });

describe("story association", () => {
  beforeEach(() => jest.clearAllMocks());

  test("requires a user id before creating an associated story", async () => {
    const res = response();

    await controller.create({ params: {}, body: { text: "Once" } }, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(db.Story.create).not.toHaveBeenCalled();
  });

  test("associates a created story with its user", async () => {
    db.User.findById.mockResolvedValue({ _id: "user-1" });
    db.Story.create.mockResolvedValue({ _id: "story-1", text: "Once" });
    db.User.findOneAndUpdate.mockResolvedValue({ _id: "user-1", story: ["story-1"] });
    const res = response();

    await controller.create({ params: { id: "user-1" }, body: { text: "Once" } }, res);

    expect(db.User.findOneAndUpdate).toHaveBeenCalledWith(
      { _id: "user-1" },
      { $set: { story: "story-1" } },
      { new: true, runValidators: true }
    );
    expect(res.status).toHaveBeenCalledWith(201);
  });

  test("does not create a story when the user does not exist", async () => {
    db.User.findById.mockResolvedValue(null);
    const res = response();

    await controller.create({ params: { id: "user-1" }, body: { text: "Once" } }, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: { code: "USER_NOT_FOUND", message: "User not found" } });
    expect(db.Story.create).not.toHaveBeenCalled();
  });

  test("deletes a created story when user association returns null", async () => {
    db.User.findById.mockResolvedValue({ _id: "user-1" });
    db.Story.create.mockResolvedValue({ _id: "story-1", text: "Once" });
    db.User.findOneAndUpdate.mockResolvedValue(null);
    db.Story.deleteOne.mockResolvedValue({ deletedCount: 1 });
    const res = response();

    await controller.create({ params: { id: "user-1" }, body: { text: "Once" } }, res);

    expect(db.Story.deleteOne).toHaveBeenCalledWith({ _id: "story-1" });
    expect(res.status).toHaveBeenCalledWith(404);
  });

  test("deletes a created story when user association fails", async () => {
    db.User.findById.mockResolvedValue({ _id: "user-1" });
    db.Story.create.mockResolvedValue({ _id: "story-1", text: "Once" });
    db.User.findOneAndUpdate.mockRejectedValue(new Error("write failed"));
    db.Story.deleteOne.mockResolvedValue({ deletedCount: 1 });
    const res = response();

    await controller.create({ params: { id: "user-1" }, body: { text: "Once" } }, res);

    expect(db.Story.deleteOne).toHaveBeenCalledWith({ _id: "story-1" });
    expect(res.status).toHaveBeenCalledWith(422);
  });
});
