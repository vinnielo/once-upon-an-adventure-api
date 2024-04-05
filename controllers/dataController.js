const { User } = require("../models");
// const bcrypt = require("bcryptjs");

// Defining methods for the dataController
module.exports = {
  findAll (req, res) {
    User.find(req.query)
      .then((dbUser) => res.json(dbUser))
      .catch((err) => res.status(422).json(err));
  },

  async create(req, res) {
    const user = await User.create(req.body);

    if (!user) {
      return res.status(400).json({ message: "Something is wrong!" });
    }
    
    res.json(user);
  },
  async login(req, res) {
    const user = await User.findOne({ $or: [{ username: req.body.username }, { email: req.body.email }] })

    if (!user) {
      return res.status(400).json({ message: "Can't find this user" });
    }
    
    const correctPw = await user.isCorrectPassword(req.body.password);

    if (!correctPw) {
      return res.status(400).json({ message: "Wrong password!" });
    }

    res.json(user);

  },
  findUserAvatar: function (req, res) {
    User.find({ _id: req.params.id })
      .populate("sprite")
      .then((dbUser) => res.json(dbUser))
      .catch((err) => res.status(521).json(err));
  },
  findUserStory: function (req, res) {
    User.find({ _id: req.params.id })
      .populate("story")
      .then((dbUser) => res.json(dbUser))
      .catch((err) => res.status(521).json(err));
  },
  findUserInventory: function (req, res) {
    User.find({ _id: req.params.id })
      .populate("inventory")
      .then((dbUser) => res.json(dbUser))
      .catch((err) => res.status(521).json(err));
  },
};
