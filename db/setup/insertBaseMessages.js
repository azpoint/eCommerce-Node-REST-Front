const { initSetup } = require('./dbsqliteSetup.js');
const knex = require('knex')( initSetup );
const fs = require('fs');

let savedMessages = JSON.parse(fs.readFileSync('./db/chatMessages.json'))

knex('messages')
    .insert(savedMessages)
    .then( () => console.log('Messages Inserted in the table'))
    .catch( error => console.log(error.message))
    .finally( () => knex.destroy())

console.log(savedMessages);