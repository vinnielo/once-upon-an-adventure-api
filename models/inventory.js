const { Schema, model } = require('mongoose');

const InventorySchema = new Schema({
    lives: {type: String},
    itemName: {type: String},
    money: {type: Number}
});
const Inventory = model("Inventory", InventorySchema);

module.exports = Inventory;
