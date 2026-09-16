const { User } = require("../models");
const { createToken } = require("../middleware/auth");

function sanitizeUser(user) {
  if (!user) return user;
  const value = typeof user.toObject === "function" ? user.toObject() : { ...user };
  delete value.password;
  return value;
}

function sendError(res, status, code, message) {
  return res.status(status).json({ error: { code, message } });
}

module.exports = {
  async findAll(req, res) {
    try {
      const users = await User.find(req.query);
      return res.json(users.map(sanitizeUser));
    } catch (error) {
      return sendError(res, 422, "USER_QUERY_FAILED", "Unable to retrieve users");
    }
  },

  async create(req, res) {
    try {
      const user = await User.create(req.body);
      return res.status(201).json(sanitizeUser(user));
    } catch (error) {
      return sendError(res, 422, "USER_CREATE_FAILED", "Unable to create user");
    }
  },

  async login(req, res) {
    try {
      const user = await User.findOne({ email: req.body.email });
      if (!user || !(await user.isCorrectPassword(req.body.password))) {
        return sendError(res, 401, "INVALID_CREDENTIALS", "Invalid email or password");
      }

      return res.json({ token: createToken(user), user: sanitizeUser(user) });
    } catch (error) {
      return sendError(res, 500, "LOGIN_FAILED", "Unable to log in");
    }
  },

  async findUser(req, res) {
    try {
      const foundUser = await User.findById(req.params.id).populate("sprite").populate("story");
      if (!foundUser) return sendError(res, 404, "USER_NOT_FOUND", "User not found");
      return res.json(sanitizeUser(foundUser));
    } catch (error) {
      return sendError(res, 422, "USER_QUERY_FAILED", "Unable to retrieve user");
    }
  },

  async findUserStory(req, res) {
    try {
      const user = await User.findById(req.params.id).populate("story");
      if (!user) return sendError(res, 404, "USER_NOT_FOUND", "User not found");
      return res.json(sanitizeUser(user));
    } catch (error) {
      return sendError(res, 422, "STORY_QUERY_FAILED", "Unable to retrieve story");
    }
  },

  async findUserInventory(req, res) {
    try {
      const user = await User.findById(req.params.id).populate("inventory");
      if (!user) return sendError(res, 404, "USER_NOT_FOUND", "User not found");
      return res.json(sanitizeUser(user));
    } catch (error) {
      return sendError(res, 422, "INVENTORY_QUERY_FAILED", "Unable to retrieve inventory");
    }
  },

  sanitizeUser,
  sendError
};
