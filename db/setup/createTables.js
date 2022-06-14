const { initSetup } = require('./dbSetup');
const knex = require('knex')( initSetup );

knex
    .schema
    .createTable('categories', table => {
        table.increments('cat_id')
        table.string('cat_name', 24)
    })
    .then( () => {
        console.log('categories table created');

        return knex.schema.createTable('products', table => {
            table.increments('id')
            table.string('title', 40)
            table.float('price')
            table.string('thumbnail', 400)
            table.integer('stock')
            table.integer('category_id').unsigned().references('categories.cat_id')
        })
    })
    .then( () => {
        console.log('products table created')
    })
    .catch( error => console.log(error.message))
    .finally( () => knex.destroy())