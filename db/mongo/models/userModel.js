const { Schema, model } = require("mongoose");

const cartSchema = new Schema({
  product_Id: { type: String, required: true },
  qty: { type: Number, required: true },
});

const userSchema = new Schema({
  username: { type: String, required: true, max: 20 },
  password: { type: String, required: true },
  alias: { type: String, required: true, max: 12 },
  avatar: { type: String, required: true },
  admin: { type: Boolean, required: true },
  cart: [cartSchema],
  phone: { type: String, required: true },
  address: { type: String, required: true },
});

module.exports = model("user", userSchema);
