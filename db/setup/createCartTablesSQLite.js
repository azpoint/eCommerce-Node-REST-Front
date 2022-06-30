const { initSetup } = require('./dbsqliteSetupCart');
const knex = require('knex')( initSetCart );

knex
    .schema
    .createTable('userNameCart', table => {
        table.string('productId')
        table.integer('qty')
    })
    .then( () => {
        console.log('UserNameCart table created');
    })
    .catch( error => console.log(error.message))
    .finally( () => knex.destroy())