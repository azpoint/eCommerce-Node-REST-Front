const express = require('express');
const { Router } = express;

const { initSetup } = require('../db/setup/dbSetup.js');
const knex = require('knex')( initSetup );

const app = express();

const adminRouter = Router();

let productList = knex
                    .from('products')
                    .select('*')
                    .then( res => {
                        baseProducts = res;
                        return baseProducts;
                    })
                    .then( () => {
                        console.log('Products Loaded')
                    })
                    .catch( error =>  console.log(error.message))
                    .finally( () => knex.destroy());


adminRouter.get('', (req, res, next) => {

    res.render('adminPanels')
})


adminRouter.get('/products', (req, res, next) => {


    if (req.query.idNumber == '') {
        console.log(productList)
    // res.render('adminProducts', { productList })
    res.send('Bueno ya')
    } 
    else {
        res.redirect(`/api/products/${req.query.idNumber}`)
    }
    
    next()
})

module.exports = adminRouter