const { User } = require("../models");
// const bcrypt = require("bcryptjs");

// Defining methods for the dataController
module.exports = {
  findAll: function (req, res) {
    User.find(req.query)
      .then((dbUser) => res.json(dbUser))
      .catch((err) => res.status(422).json(err));
  },
  async create(req, res) {
    const user = await User.create(req.body);

    if (!user) {
      return res.status(400).json({ message: "Something is wrong!" });
    }
    // const token = signToken(user);
    res.json(user);
  },
  async findUser(req, res) {
    const userData = await User.find({ email: req.body.email }).populate(
      "sprite"
    );

    if (!userData) {
      return res.status(400).json({ message: "Can't find this user" });
    }
    const correctPw = await userData.isCorrectPassword(body.password);

    if (!correctPw) {
      return res.status(400).json({ message: "Wrong password!" });
    }

    res.json(userData);

    // .then((dbUser) => {
    //   const ah = bcrypt
    //     .compare(req.body.password, dbUser[0].password)
    //     .then((result) => {
    //       if (result === true) {
    //         res.json(dbUser);
    //       } else {
    //         res.status(404).send({ error: "boo:(" });
    //       }
    //     });
    // })
    // .catch((err) => res.status(422).json(err));
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
