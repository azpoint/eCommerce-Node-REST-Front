//------- Dependencies -------
const express = require('express');
const { Router } = express;
const app = express();

const { initSetup } = require('../db/setup/dbSetup.js');
const knex = require('knex')( initSetup );


//-------- Modules --------
const Contenedor = require('../operative/productHandlerDB.js');

//--------- Database ---------
  let baseProducts = knex
    .from('products')
    .select('*')
    .then( res => {
        baseProducts = res;
        return baseProducts;
    })
    .then( () => {
        console.log('Products Loaded')
    })
    .catch( error =>  console.log(error.message))
    .finally( () => knex.destroy())


//------- Router --------

// productosRouter.get('/:idNumber', (req, res) => {    
//     return res.status(200).json(productList.getById(req.params.idNumber));    
// })

const productsRouter = Router();

let productList = new Contenedor(baseProducts);


productsRouter.get('/:idNumber', (req, res, next) => {


    if (productList.getLast().id < req.params.idNumber) {
        return res.status(200).render('error', { message: 'This product is not available' })
    } else if (req.params.idNumber) {
        return res.status(200).json(productList.getById(req.params.idNumber))
    }

    next()
})



productsRouter.post('', ( req, res, next) => {

    res.status(200).json(productList.newProduct(req.body.title, Number(req.body.price), req.body.thumbnail))
    
    productList.exportProducts();

    next();
})


productsRouter.get('', (req, res, next) => {
    res.send('Ejaqui')
    console.log(productList.getAll())
    next();
})



productsRouter.post('/put', (req, res, next) => {

    let productToModify = productList.getById(Number(req.body.id));
  
    if (req.body.title) { productToModify.title = req.body.title }
    if (req.body.price) { productToModify.price = Number(req.body.price) }
    if (req.body.thumbnail) { productToModify.thumbnail = req.body.thumbnail }

    
    productList.getAll().splice(req.body.id, 1, productToModify);

    res.status(200).json(productList.getById(req.body.id));

    productList.exportProducts();
    
    next()
})


productsRouter.post('/delete', (req, res, next) => {

    res.status(200).json(productList.deleteById(Number(req.body.id)));

    productList.exportProducts();

    io.sockets.emit('productRefresh', 'DELETE');

    next();
})



module.exports = productsRouter;