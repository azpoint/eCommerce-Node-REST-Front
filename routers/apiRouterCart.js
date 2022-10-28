const express = require("express");
const { Router } = express;

const ProductsMongo = require("../operative/productHandlerMongo");
const db = require("../db/mongo/db");
const productModel = require("../db/mongo/models/productsModel");

const apiRouterCart = Router();

const productsMongo = new ProductsMongo(db, productModel);



// --------- ENDPOINTS AUTH ---------

// apiRouterCart.use((req, res, next) => {
//     console.log(req.user)

//     if (req.user && req.user.admin) {
//       return next();
//     }
  
//     return res.status(403).json( { message: 'Log as admin in the web service to retrieve this service' } );
//   });

  apiRouterCart.get("/", (req, res) => {
    console.log(req.user)
  })


// --------- CART ENDPOINTS---------





module.exports = apiRouterCart;
