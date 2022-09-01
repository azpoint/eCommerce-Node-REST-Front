const express = require('express');
const { Router } = express;
const CartModel = require('../operative/cartBuilder')
const ProductsMongo = require('../operative/productHandlerMongo')


const db = require('../db/mongo/db')
const cartModel = require('../db/mongo/models/cartModel')
const productModel = require('../db/mongo/models/productsModel')
const userModel = require('../db/mongo/models/userModel')

const cartRouter = Router();

const cart = new CartModel(db, userModel)
const productsMongo = new ProductsMongo(db, productModel)


cartRouter.get('', (req, res) => {
   return res.redirect('cart/products')
})

cartRouter.get('/products', (req, res) => {
    let cartAmount = 0;
    let logName = '';
    let avatarDir = ''

    if (req.user && req.user.alias) {
        logName = req.user.alias
        avatarDir = req.user.avatar
    }

    if(!req.user) {
        return res.render('error', { message: "You should be logged before adding stuff"})
    }


    return cart.getAllCart(req.user._id)
    .then( resp => {
        let cartListRender = [];
        let cartList = [];

        resp.forEach( item => {
            cartList.push(item.product_Id)
        })

        ;(async () => {
            cartListRender = await productsMongo.getMany(cartList);
            for (let item of cartListRender) {
                for (let item2 of resp) {
                    if(item._id == item2.product_Id) {
                        item.qty = item2.qty
                    }
                }
            }

            cartListRender.forEach( item => {
                cartAmount += item.price *item.qty
            })

            cartAmount.toFixed(2)
            
            res.render('cartList', { cartListRender, cartAmount, logName, avatarDir })
        })()
        
    })
})



cartRouter.post('/products/:id', (req, res) => {
    let userId = req.user._id
    let idp = {
        product_Id: req.params.id,
        qty: 1
    }

    if(!req.user){ return null }

    // return cart.addProduct(userId, idp)

    return cart.itemCheck(userId, req.params.id)
        .then( resp => { 
            if(resp === undefined) {
                return cart.addProduct(userId, idp)
            } else {

            }
        })

    // return cart.itemCheck(req.params.id)
    // .then( resp => {
    //     let itemCheck = resp;

    //     if(itemCheck === 0) {
    //         return cart.addProduct(id, idp)
    //     } else {
    //         return cart.addQty(req.params.id)
    //     }
    // })
})

cartRouter.delete('/products/:id', (req, res) => {
    return cart.deleteById(req.user._id, req.params.id)
    .then( resp => {
        console.log( resp)
    })
})

module.exports = cartRouter