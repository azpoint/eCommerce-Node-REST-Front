const express = require('express');
const { Router } = express;

const { initSetup } = require('../db/setup/dbSetup.js');
const knex = require('knex')( initSetup );

const app = express();

const adminRouter = Router();

adminRouter.get('', (req, res, next) => {

    res.render('adminPanels')
})


adminRouter.get('/products', (req, res) => {


    if (req.query.idNumber == '') {
        knex.from('products').select('*').then( resp => {
            let productList = resp
            res.render('adminProducts', { productList })
        })
    } else {
        knex.from('products').select('*').where('id', req.query.idNumber)
        .then( resp => {
            let productList = resp;
            if (productList == ''){
                let message = 'This product do not exist'
                res.render('error', { message })
            }
            res.render('adminProducts', { productList })
        })
    }
})

adminRouter.post('/products', (req, res) => {
    let productToAdd = {
        title: req.body.title,
        price: req.body.price,
        thumbnail: req.body.thumbnail,
        stock: Math.floor(Math.random() * 101)
    };

    knex('products')
        .insert(productToAdd)
        .then( (newId) => {
            knex.select('*').from('products').where('id', newId)
            .then( resp => {
                let productList = resp;
                res.render('adminResponse', { productList, message: 'Product added successfully' })
            })          
        })
})

adminRouter.post('/products/delete', (req, res) => {
    knex.from('products').where('id', req.body.id).del()
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

    knex.from('products')
        .where('id', Number(req.body.id))
        .update( productUpdate)
        .then( () => {
            knex.select('*').from('products').where('id', req.body.id)
            .then( resp => {
                let productList = resp;
                res.render('adminResponse', { productList, message: 'Product Modified'})
            })
        })
})



module.exports = adminRouter