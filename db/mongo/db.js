const mongoose = require('mongoose');
const envConfig = require('../../envConfig');


const URL = `mongodb+srv://AZL:${envConfig.mongo_pass}@cluster0.wtqnueb.mongodb.net/ecommerce_teck?retryWrites=true&w=majority`;

const connection = mongoose.connect(URL)
.then( _ => console.log('Connected to Atlas...')).catch( e => {
    console.log('Database Connectivity error')
})

module.exports = connection