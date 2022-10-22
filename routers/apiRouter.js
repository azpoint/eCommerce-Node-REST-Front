const express = require("express");
const { Router } = express;

const ProductsMongo = require("../operative/productHandlerMongo");
const db = require("../db/mongo/db");
const productModel = require("../db/mongo/models/productsModel");

const apiRouter = Router();

const productsMongo = new ProductsMongo(db, productModel);

// ------- ROUTER --------

// apiRouter.use((req, res, next) => {
//     if (req.user && req.user.admin) {
//       return next();
//     }
  
//     return res.status(403).json( { message: 'Log as admin to retrieve this service' } );
//   });
  
apiRouter.get("/productos/", (req, res) => {
    return productsMongo.getAll()
    .then((productList) => {
        return res.status(200).json(productList);
    })
})

apiRouter.get("/productos/:id", (req, res) => {
    return productsMongo.getById(req.params.id)
    .then( singleProduct => {
        return res.status(200).json( singleProduct);
    }).catch(e => {
        res.status(400).json( { message: 'Whoops, please provida a valid product id'});
    }) 
})

apiRouter.post("/productos", (req, res) => {

    let productToAdd = {
        title: req.body.title,
        price: Number(req.body.price),
        thumbnail: req.body.thumbnail,
        category: req.body.category
      };

      return productsMongo.addProduct(productToAdd)
      .then(resp => {
        return res.status(200).json(resp)
      }).catch( e => {
        return res.status(400).json( { message: 'You need to provide a json format object with all the keys and values in the following format',
        json_Format: {  title: "String",
                        price: "Number",
                        thumbnail: "String",
                        category: "String"
                    }
        } );
    })
})

apiRouter.put("/productos/:id", (req,res) => {

    let productUpdate = req.body;

    return productsMongo.updateProduct(req.params.id, productUpdate)
    .then(resp => {
        if(resp.acknowledged === false) {
            throw new Error('catch it!')
        }

        return productsMongo.getById(req.params.id)
        .then(resp => {
            return res.status(200).json(resp)
        })
    }).catch( e => {
        return res.status(400).json( { message: 'You need to provide a json format object with one or more keys in the following format',
        json_Format: {  title: "String",
                        price: "Number",
                        thumbnail: "String",
                        category: "String"
                    }
        } );
    })
})

apiRouter.delete("/productos/:id", (req, res) => {
    return productsMongo.deleteById(req.params.id)
    .then(resp => {
        if(resp.acknowledged === true) {
            return res.status(200).json( { message: "Product deleted"} )
        }
    }).catch(e => {
        res.status(400).json( { message: 'Whoops, please provida a valid product id'});
    }) 
})

apiRouter.get("/productos/categoria/:category", (req, res) => {
    return productsMongo.getCategory(req.params.category)
    .then( resp => {
        if(resp.length !== 0) {
            return res.status(200).json(resp);            
        }

        return res.status(400).json( { message: "Whoops, please provide a valid category" } )
    })
})

  module.exports = apiRouter;