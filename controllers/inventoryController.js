const db = require("../models");

function sendError(res, status, code, message) {
  return res.status(status).json({ error: { code, message } });
}

async function deleteInventory(inventory) {
  if (!inventory) return;
  try {
    await db.Inventory.deleteOne({ _id: inventory._id });
  } catch (error) {
    // Preserve the association error when compensating cleanup also fails.
  }
}

module.exports = {
  async findAll(req, res) {
    try {
      return res.json(await db.Inventory.find(req.query));
    } catch (error) {
      return sendError(res, 422, "INVENTORY_QUERY_FAILED", "Unable to retrieve inventory");
    }
  },

  async create(req, res) {
    if (!req.params.id) return sendError(res, 400, "USER_ID_REQUIRED", "User id is required");
    let inventory;
    try {
      const existingUser = await db.User.findById(req.params.id);
      if (!existingUser) return sendError(res, 404, "USER_NOT_FOUND", "User not found");
      inventory = await db.Inventory.create(req.body);
      const user = await db.User.findOneAndUpdate(
        { _id: req.params.id },
        { $addToSet: { inventory: inventory._id } },
        { new: true, runValidators: true }
      );
      if (!user) {
        await deleteInventory(inventory);
        return sendError(res, 404, "USER_NOT_FOUND", "User not found");
      }
      return res.status(201).json(inventory);
    } catch (error) {
      await deleteInventory(inventory);
      return sendError(res, 422, "INVENTORY_CREATE_FAILED", "Unable to create inventory");
    }
  },

  async findInventory(req, res) {
    try {
      return res.json(await db.Inventory.find({}));
    } catch (error) {
      return sendError(res, 422, "INVENTORY_QUERY_FAILED", "Unable to retrieve inventory");
    }
  }
};
