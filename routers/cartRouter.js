const express = require('express');
const { Router } = express;
const NewCart = require('../operative/cartBuilder.js')


const cartRouter = Router();


let cartList = new NewCart();
let cartCreated = false

let cartListRender = cartList.show();

cartRouter.get('', (req, res, next) => {

    if (cartCreated == false) {
        cartList.newCart();
        cartCreated = true;
        res.json(cartList.show());
    } else if ( cartCreated == true) {
        res.json('A cart already exist!')
    }

    next();
})

cartRouter.get('/products', (req, res, next) => {

    let cartAmount = 0;

    for (obj of cartListRender) {
        cartAmount += obj.price;
    }

    cartAmount.toFixed();

    res.render('cartList', { cartListRender, cartAmount });    

    next();
})

cartRouter.post('/products/:id', (req, res, next) => {    
    
    cartList.addProduct(req.params.id);
    res.json(cartList.show());

    next();
})

cartRouter.delete('/products/:id', (req, res, next) => {
    if (cartList.show()[0] == undefined) {
        return res.json('Product not in the list')
    }
    cartList.deleteById(req.params.id);
    res.json(cartList.show());
    next();
})

module.exports = cartRouter