const express = require('express');
const { Router } = express;
const ProductsMySQL = require('../operative/productHandlerSQL')

const { initSetup } = require('../db/setup/dbSetup.js');
const knex = require('knex')( initSetup );

const app = express();

const adminRouter = Router();

const productsSQL = new ProductsMySQL(initSetup, 'products')


//------- ROUTER -------


adminRouter.get('', (req, res, next) => {

    res.render('adminPanels')
    next()
})


adminRouter.get('/products', (req, res) => {


    if (req.query.idNumber == '') {
        // ;(async () => {
        //     const productList = await productsSQL.getAll()
        //     res.render('adminProducts', { productList })               
        // })()
        
        return productsSQL.getAll()
        .then(productList => {
            res.render('adminProducts', { productList })
        })
    } else {
        return productsSQL.getById(req.query.idNumber)
        .then( resp => {
            if(resp == '') {
                let message = 'This product does not exist'
                res.render('error', { message })
            }
            let productList = resp
            res.render('adminProducts', { productList })
        })
    }
})

adminRouter.post('/products', (req, res, next) => {
    let productToAdd = {
        title: req.body.title,
        price: req.body.price,
        thumbnail: req.body.thumbnail,
        stock: Math.floor(Math.random() * 101)
    };

    return productsSQL.addProduct(productToAdd)
    .then( resp => {
        let productList = resp
        res.render('adminResponse', { productList, message: 'Product added successfully'})
    })
    .finally(_ => {
        next()
    })

})

adminRouter.post('/products/delete', (req, res) => {
    return productsSQL.deleteById(req.body.id)
    .then( (resp) => {
        if (resp === 0) {
        res.render('adminDeleteResponse', { message: 'This product is not in the DB'})
        } else if (resp === 1) {
            res.render('adminDeleteResponse', { message: 'Product deleted'})
            
        }
    })
})


adminRouter.post('/products/put', (req, res) => {

    let productUpdate = {}

    if (req.body.title !== '') { productUpdate.title = req.body.title }
    if (req.body.price !== '') { productUpdate.price = Number(req.body.price) }
    if (req.body.thumbnail !== '') { productUpdate.thumbnail = req.body.thumbnail }
    
    return productsSQL.updateProduct(Number(req.body.id), productUpdate)
    .then( resp => {
        if (resp !== 0) {
            let productList = resp;
            res.render('adminResponse', { productList, message: ' Product Updated'})
        } else {
            res.render('adminDeleteResponse', { message: 'This product does not exist'})
        }
    })
    .catch( _ => {
        res.render('error', { message: 'You need to add at least one vale' })
    })
})



module.exports = adminRouter