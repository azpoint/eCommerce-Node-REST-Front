const { initSetup } = require('./dbSetup');
const knex = require('knex')( initSetup );
const fs = require('fs');

let productsInit = JSON.parse(fs.readFileSync('./db/products.json'))

let productsModified = []


for (product of productsInit) {
    productsModified.push(
        { 
        title: product.title,
        price: product.price,
        thumbnail: product.thumbnail,
        stock: Math.floor(Math.random() * 101)
        }
    ) 
}

knex('products')
    .insert(productsModified)
    .then( () => console.log('Products Inserted'))
    .catch( error => console.log(error.message))
    .finally( () => knex.destroy())