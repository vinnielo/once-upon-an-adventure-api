const { Schema, model } = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    match: [/.+@.+\..+/, 'Must use a valid email address'],
  },
  password: {
    type: String,
    required: true,
  },
  sprite: [
    {
      type: Schema.Types.ObjectId,
      ref: "Sprite" 
    }
  ],
  story: [
    {
      type: Schema.Types.ObjectId,
      ref: "Story" 
    }
  ],
  hearts: {
    type: String
  },
  inventory: [
    {
      type: Schema.Types.ObjectId,
      ref: "Inventory"
    }
  ]
});

// hash user password
userSchema.pre('save', async function (next) {
  if (this.isNew || this.isModified('password')) {
    const saltRounds = 10;
    this.password = await bcrypt.hash(this.password, saltRounds);
  }

  next();
});

// custom method to compare and validate password for logging in
userSchema.methods.isCorrectPassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

const User = model("User", userSchema);


module.exports = User;
