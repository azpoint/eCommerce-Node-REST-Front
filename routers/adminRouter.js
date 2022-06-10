const express = require('express');
const { Router } = express;
const fs = require('fs');

const app = express();

const { Server: IOServer } = require('socket.io');
const { Server: HttpServer } = require('http');

const httpServer = new HttpServer(app);
const io = new IOServer(httpServer);


const adminRouter = Router();

let productList = JSON.parse(fs.readFileSync('./db/products.json'));


adminRouter.get('', (req, res, next) => {
    io.sockets.emit('productRefresh', 'POST');

    res.render('adminPanels')
})


adminRouter.get('/products', (req, res, next) => {


    if (req.query.idNumber == '') {
    res.render('adminProducts', { productList })
    } 
    else {
        res.redirect(`/api/products/${req.query.idNumber}`)
    }
    
    next()
})

module.exports = adminRouter