const envConfig = require("../envConfig");
const express = require("express");
const { Router } = express;

// --------- APP ---------
const db = require("../db/mongo/db");
const CartModel = require("../operative/cartBuilder");
const ProductsMongo = require("../operative/productHandlerMongo");
const userModel = require("../db/mongo/models/userModel");
const productModel = require("../db/mongo/models/productsModel");
const productsMongo = new ProductsMongo(db, productModel);
const cart = new CartModel(db, userModel);

const AuthMiddleware = require('../Middlewares/jwtAuthMiddleware.js');
const authMiddleware = new AuthMiddleware(envConfig.jwt_secret);
const apiRouterCart = Router();

// -------- MIDDLEWARES ---------
apiRouterCart.use(authMiddleware.verifyToken.bind(authMiddleware));

// --------- CART ENDPOINTS---------
apiRouterCart.get("/", (req, res) => {
  console.log(req.user.id)

  return cart.getAllCart(req.user.id).then( cart => {
    if(!cart) {
      return res.status(400).json({ error: 'User not found' })
    }
    return res.status(200).json(cart)
  })
})

apiRouterCart.post('/:id', (req, res) => {
  let idp = {
    product_Id: req.params.id,
    qty: 1
  };

  return cart.itemCheck(req.user.id, req.params.id).then((resp) => {

    console.log(resp)
    return productsMongo.getById(req.params.id).then( isAvailable => {
      if(isAvailable && !resp) {
        ;(async () => {
          await cart.addProduct(req.user.id, idp)
          return res.status(200).json({ message: 'Product added'})
        })();
      }

      if(resp) {
        ;(async () => {
          await cart.addQty(req.user.id, req.params.id)
          return res.status(200).json({ message: 'Product qty increased'})
        })();
      }
    })
  }).catch(err => {
    return res.status(400).json( {message: 'Please send a valid product id'} )
  });
});

apiRouterCart.delete('/:id', (req, res) => {

  return cart.deleteById(req.user.id, req.params.id).then( resp => {
    if(resp === true) {
      return res.status(200).json({ message: 'Product deleted'})
    }
     return res.status(400).json({ message: 'Please provide a valid id'})
  })
})





module.exports = apiRouterCart;
