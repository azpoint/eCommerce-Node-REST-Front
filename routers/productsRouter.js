//------- Dependencies -------
const fs = require('fs');
const express = require('express');
const { Router } = express;
const app = express();

const { Server: IOServer } = require('socket.io');
const { Server: HttpServer } = require('http');

const httpServer = new HttpServer(app);
const io = new IOServer(httpServer);


//-------- Modules --------
const Contenedor = require('../operative/productHandler.js');

//--------- Database ---------
let baseProducts = JSON.parse(fs.readFileSync('./db/products.json'));

//------- Router --------

// productosRouter.get('/:idNumber', (req, res) => {    
//     return res.status(200).json(productList.getById(req.params.idNumber));    
// })

const productsRouter = Router();

let productList = new Contenedor(baseProducts);

productList.idStarter();


productsRouter.get('/:idNumber', (req, res, next) => {

    io.sockets.emit('productRefresh', 'POST');

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

    io.sockets.emit('productRefresh', 'POST');

    next();
})


productsRouter.get('/refreshList', (req, res, next) => {
    res.json(productList.getAll());
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

    io.sockets.emit('productRefresh', 'PUT');
    
    next()
})


productsRouter.post('/delete', (req, res, next) => {

    res.status(200).json(productList.deleteById(Number(req.body.id)));

    productList.exportProducts();

    io.sockets.emit('productRefresh', 'DELETE');

    next();
})



module.exports = productsRouter;