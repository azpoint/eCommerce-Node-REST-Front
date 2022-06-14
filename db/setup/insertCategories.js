const { initSetup } = require('./dbSetup');
const knex = require('knex')( initSetup );

const initCategories = [
    {cat_name: 'Peripherals'},
    {cat_name: 'Consoles'},
    {cat_name: 'CPUs'},
    {cat_name: 'Ram'},
    {cat_name: 'Mother Boards'},
    {cat_name: 'RGB Stuff'},
]


knex('categories')
.insert(initCategories)
.then( () => {
    console.log('Categories Inserted')
})
.catch( error => console.log(error.message))
.finally( () => knex.destroy())