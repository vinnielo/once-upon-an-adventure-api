jest.mock("../models", () => ({
  Inventory: { create: jest.fn(), deleteOne: jest.fn() },
  User: { findById: jest.fn(), findOneAndUpdate: jest.fn() }
}));

const db = require("../models");
const controller = require("../controllers/inventoryController");
const response = () => ({ status: jest.fn().mockReturnThis(), json: jest.fn() });

describe("inventory association", () => {
  beforeEach(() => jest.clearAllMocks());

  test("creates inventory and associates it with the required user id", async () => {
    db.User.findById.mockResolvedValue({ _id: "user-1" });
    db.Inventory.create.mockResolvedValue({ _id: "item-1", itemName: "Key" });
    db.User.findOneAndUpdate.mockResolvedValue({ _id: "user-1", inventory: ["item-1"] });
    const res = response();

    await controller.create({ params: { id: "user-1" }, body: { itemName: "Key" } }, res);

    expect(db.User.findOneAndUpdate).toHaveBeenCalledWith(
      { _id: "user-1" },
      { $addToSet: { inventory: "item-1" } },
      { new: true, runValidators: true }
    );
    expect(res.status).toHaveBeenCalledWith(201);
  });

  test("does not create inventory when the user does not exist", async () => {
    db.User.findById.mockResolvedValue(null);
    const res = response();

    await controller.create({ params: { id: "user-1" }, body: { itemName: "Key" } }, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: { code: "USER_NOT_FOUND", message: "User not found" } });
    expect(db.Inventory.create).not.toHaveBeenCalled();
  });

  test("rejects a missing association id", async () => {
    const res = response();

    await controller.create({ params: {}, body: { itemName: "Key" } }, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(db.Inventory.create).not.toHaveBeenCalled();
  });

  test("deletes created inventory when user association returns null", async () => {
    db.User.findById.mockResolvedValue({ _id: "user-1" });
    db.Inventory.create.mockResolvedValue({ _id: "item-1", itemName: "Key" });
    db.User.findOneAndUpdate.mockResolvedValue(null);
    db.Inventory.deleteOne.mockResolvedValue({ deletedCount: 1 });
    const res = response();

    await controller.create({ params: { id: "user-1" }, body: { itemName: "Key" } }, res);

    expect(db.Inventory.deleteOne).toHaveBeenCalledWith({ _id: "item-1" });
    expect(res.status).toHaveBeenCalledWith(404);
  });

  test("deletes created inventory when user association fails", async () => {
    db.User.findById.mockResolvedValue({ _id: "user-1" });
    db.Inventory.create.mockResolvedValue({ _id: "item-1", itemName: "Key" });
    db.User.findOneAndUpdate.mockRejectedValue(new Error("write failed"));
    db.Inventory.deleteOne.mockResolvedValue({ deletedCount: 1 });
    const res = response();

    await controller.create({ params: { id: "user-1" }, body: { itemName: "Key" } }, res);

    expect(db.Inventory.deleteOne).toHaveBeenCalledWith({ _id: "item-1" });
    expect(res.status).toHaveBeenCalledWith(422);
  });
});
