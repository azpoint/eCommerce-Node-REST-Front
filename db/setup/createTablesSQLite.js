const { initSetup } = require('./dbsqliteSetup.js');
const knex = require('knex')( initSetup );

knex
    .schema
    .createTable('messages', table => {
        table.increments('id_message')
        table.string('text', 1024)
        table.string('user', 16)
        table.string('date', 22)
    })
    .then( () => {
        console.log('Messages table created');
    })
    .catch( error => console.log(error.message))
    .finally( () => knex.destroy())