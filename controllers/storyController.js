const db = require("../models");

function sendError(res, status, code, message) {
  return res.status(status).json({ error: { code, message } });
}

async function deleteStory(story) {
  if (!story) return;
  try {
    await db.Story.deleteOne({ _id: story._id });
  } catch (error) {
    // Preserve the association error when compensating cleanup also fails.
  }
}

module.exports = {
  async findAll(req, res) {
    try {
      return res.json(await db.Story.find(req.query));
    } catch (error) {
      return sendError(res, 422, "STORY_QUERY_FAILED", "Unable to retrieve stories");
    }
  },

  async create(req, res) {
    if (!req.params.id) return sendError(res, 400, "USER_ID_REQUIRED", "User id is required");
    let story;
    try {
      const existingUser = await db.User.findById(req.params.id);
      if (!existingUser) return sendError(res, 404, "USER_NOT_FOUND", "User not found");
      story = await db.Story.create(req.body);
      const user = await db.User.findOneAndUpdate(
        { _id: req.params.id },
        { $set: { story: story._id } },
        { new: true, runValidators: true }
      );
      if (!user) {
        await deleteStory(story);
        return sendError(res, 404, "USER_NOT_FOUND", "User not found");
      }
      return res.status(201).json(story);
    } catch (error) {
      await deleteStory(story);
      return sendError(res, 422, "STORY_CREATE_FAILED", "Unable to create story");
    }
  },

  async updateStory(req, res) {
    if (!req.params.text) return sendError(res, 400, "INVALID_STORY", "Story text is required");
    try {
      const user = await db.User.findById(req.params.id);
      const storyId = user && Array.isArray(user.story) ? user.story[0] : user && user.story;
      if (!storyId) return sendError(res, 404, "STORY_NOT_FOUND", "Story not found for user");
      const story = await db.Story.findOneAndUpdate(
        { _id: storyId },
        { $set: { text: req.params.text } },
        { new: true, runValidators: true }
      );
      if (!story) return sendError(res, 404, "STORY_NOT_FOUND", "Story not found for user");
      return res.json(story);
    } catch (error) {
      return sendError(res, 422, "STORY_UPDATE_FAILED", "Unable to update story");
    }
  }
};
