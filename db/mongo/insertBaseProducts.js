const { initSetup } = require('../setup/dbSetup');
const knex = require('knex')( initSetup );

const db = require('../mongo/db')
const productModel = require('./models/productsModel')


return knex.select('*').from('products')
.then(resp => {

    db
    .then(_ => productModel.insertMany(resp))
    .then( doc => {
        console.log('Saved', doc)
    }).catch( err => console.error(err.message))
    .finally( _ => process.exit())
})