const { Schema, model } = require('mongoose');

const productsSchema = new Schema({
    title: { type: String, required: true, max: 20},
    price: { type: Number, required: true},
    thumbnail: { type: String, required: true},
    stock: { type: Number, required: true, max: 200}
})

module.exports = model('products', productsSchema)