const { Schema, model } = require('mongoose');

const cartSchema = new Schema({
    product_Id: { type: String, required: true},
    qty: { type: Number, required: true}
})

module.exports = model('userCart', cartSchema)