const envConfig = require("../envConfig");
const express = require("express");
const { Router } = express;

// -------- APP --------
const db = require("../db/mongo/db");
const ProductsMongo = require("../operative/productHandlerMongo");
const productModel = require("../db/mongo/models/productsModel");
const productsMongo = new ProductsMongo(db, productModel);
const AuthMiddleware = require('../Middlewares/jwtAuthMiddleware.js');
const authMiddleware = new AuthMiddleware(envConfig.jwt_secret);

const apiRouter = Router();

// -------- MIDDLEWARES ---------
// ----- La inyeccion de la variable envConfig.jwt_secret no funcionaba aqui hasta que hice el bind, pero no entiendo como funciona ni que hace. Me llegaba undefined.
apiRouter.use(authMiddleware.verifyToken.bind(authMiddleware));

// ------- CRUD ENDPOINTS --------
// ------- GET --------  
apiRouter.get("/", (req, res) => {

    return productsMongo.getAll()
    .then((productList) => {
        return res.status(200).json(productList);
    })
});

apiRouter.get("/:id", (req, res) => {
    return productsMongo.getById(req.params.id)
    .then( singleProduct => {
        return res.status(200).json( singleProduct);
    }).catch(e => {
        res.status(400).json( { message: 'Whoops, please provida a valid product id'});
    }) 
});

apiRouter.get("/categoria/:category", (req, res) => {
    return productsMongo.getCategory(req.params.category)
    .then( resp => {
        if(resp.length !== 0) {
            return res.status(200).json(resp);            
        }

        return res.status(400).json( { message: "Whoops, please provide a valid category" } )
    })
});

// -------- POST --------
apiRouter.post("/", (req, res) => {

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
});

// ---------- PUT ---------
apiRouter.put("/:id", (req,res) => {

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
        return res.status(400).json( { message: 'You need to provide a valid id in the URL and a json format object with one or more keys in the following format',
        json_Format: {  title: "String",
                        price: "Number",
                        thumbnail: "String",
                        category: "String"
                    }
        } );
    })
});

// --------- DELETE -------
apiRouter.delete("/:id", (req, res) => {
    return productsMongo.deleteById(req.params.id)
    .then(resp => {
        if(resp.acknowledged === true) {
            return res.status(200).json( { message: "Product deleted"} )
        }
    }).catch(e => {
        res.status(400).json( { message: 'Whoops, please provida a valid product id'});
    }) 
});


module.exports = apiRouter;