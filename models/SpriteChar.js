const { Schema, model } = require('mongoose');

const SpriteSchema = new Schema({
    sprite: {type: String},
    name: { type: String, required: true },
    homeFirst: {type: Boolean, default: true},
    place: {type: String, default: "home"},
    position: {type: [Number], default: [0, 448]},
    apiFirstGuardTalk: {type: Boolean, default: true},
    apiFirstOrcTalk: {type: Boolean, default: true},
    apiFirstJaceTalk: {type: Boolean, default: true},
    apiFirstThiefTalk: {type: Boolean, default: true},
    lives: {type: Number, default: 3, min: 0},
    permit: {type: Boolean, default: false},
    money: {type: Number, default: 0, min: 0}

});
const Sprite = model("Sprite", SpriteSchema);

module.exports = Sprite;
