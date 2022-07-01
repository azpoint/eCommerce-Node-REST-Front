const express = require('express');
const { Router } = express;
const CartModel = require('../operative/cartBuilder')
const ProductsMongo = require('../operative/productHandlerMongo')


const db = require('../db/mongo/db')
const cartModel = require('../db/mongo/models/cartModel')
const productModel = require('../db/mongo/models/productsModel')

const cartRouter = Router();

const cart = new CartModel(db, cartModel)
const productsMongo = new ProductsMongo(db, productModel)


cartRouter.get('', (req, res) => {
    res.redirect('api/cart/products')
})

cartRouter.get('/products', (req, res) => {
    let cartAmount = 0;

    return cart.getAllCart()
    .then( resp => {
        let cartList = [];
        let cartQty = [];
        resp.forEach( item => {
            cartList.push(item.product_Id)
            cartQty.push(item.qty)
        })

        return productsMongo.getMany(cartList)
        .then( resp => {
            let cartListRender = resp;

            cartListRender.forEach( (item, index) => {
                item.qty = cartQty[index];
                cartAmount += item.price * (cartQty[index])
            })
            
            cartAmount.toFixed(2)
            res.render('cartList', { cartListRender, cartAmount })
        })

    })

})

cartRouter.post('/products/:id', (req, res) => {    
    let idp = {
        product_Id: req.params.id,
        qty: 1
    }

    return cart.itemCheck(req.params.id)
    .then( resp => {
        let itemCheck = resp;

        if(itemCheck === 0) {
            return cart.addProduct(idp)
            .then( resp => {
                console.log('Add product', resp)
            })
        } else {
            return cart.addQty(req.params.id)
            .then( resp => {
                console.log('Add Qty', resp)
            })
        }
    })
})

cartRouter.delete('/products/:id', (req, res) => {
    return cart.deleteById(req.params.id)
    .then( resp => {
        console.log( resp)
    })
})

module.exports = cartRouter