const express = require('express');
const { Router } = express;
const CartModel = require('../operative/cartBuilder')

const { initSetup } = require('../db/setup/dbSetup.js');
const { initSetCart } = require('../db/setup/dbsqliteSetupCart');

const knex = require('knex')(initSetup)

const cartRouter = Router();

const cartSQLite = new CartModel(initSetCart, 'userNameCart')


cartRouter.get('', (req, res, next) => {

    return cartSQLite.newCart()
    .then( resp => {
        if (resp.errno == 1) {
            res.redirect('/api/cart/products')
        } else {
            console.log(resp)
            res.redirect('/api/cart/products')
        }
    })   

    next()
})

cartRouter.get('/products', (req, res) => {
    let cartAmount = 0;

    return cartSQLite.show()
    .then( resp => {
        if ( resp.errno == 1) {
            res.redirect('/api/cart')
        } else {
            let cartList = [];
            let cartQty = [];
            for (item of resp) {
                cartList.push(item.productId)
                cartQty.push(item.qty)
            }                        
            return knex.select('*').from('products').whereIn('id', cartList)
            .then( resp => {
                let cartListRender = resp;
                cartListRender.forEach((item, index) => {
                    item.qty = cartQty[index]
                    cartAmount += item.price * item.qty;
                    
                })
                cartAmount.toFixed(3);
                res.render('cartList', { cartListRender, cartAmount })
            })            
        }
    })
})

cartRouter.post('/products/:id', (req, res, next) => {    
    let idp = {
        productId: Number(req.params.id),
        qty: 1
    }
    return cartSQLite.show()
    .then( cartItems => {
        if ( cartItems.errno === 1) {
            return cartSQLite.newCart()
            .then( _ => {
                return cartSQLite.addProduct(idp)
            })
        } else {
            let itemFilter = cartItems.filter( item => item.productId == req.params.id)
            
            if (itemFilter.length > 0) {
                return cartSQLite.addQty(Number(req.params.id))
                .then(_ => {
                    console.log('Product Qty Added')
                })
            } else if (itemFilter.length === 0) {
                return cartSQLite.addProduct(idp)
                .then(_ => {
                    console.log('Product Added')
                })
            }
            
            console.log(itemFilter, req.params.id)
        }
    })


    next();
})

cartRouter.delete('/products/:id', (req, res, next) => {
    return cartSQLite.deleteById(Number(req.params.id))
    .then( resp => {
        console.log(resp)
    })
    next();
})

module.exports = cartRouter