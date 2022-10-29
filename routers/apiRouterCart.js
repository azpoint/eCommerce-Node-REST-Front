const express = require("express");
const { Router } = express;

const ProductsMongo = require("../operative/productHandlerMongo");
const db = require("../db/mongo/db");
const productModel = require("../db/mongo/models/productsModel");

const apiRouterCart = Router();

const productsMongo = new ProductsMongo(db, productModel);



apiRouterCart.get("/", (req, res) => {
  console.log(req.user)
})


// --------- CART ENDPOINTS---------





module.exports = apiRouterCart;
