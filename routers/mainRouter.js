const express = require('express');
const { Router } = express;
const session = require('express-session');
const cookieParser = require('cookie-parser');

const mainRouter = Router();
// -------- DB --------

const db = require('../db/mongo/db')
const productModel = require('../db/mongo/models/productsModel');
const MongoStore = require('connect-mongo');

//--------Middlewares --------

mainRouter.use(session({
    store: MongoStore.create({mongoUrl: 'mongodb+srv://AZL:C1RIIU6ywWLWBCMO@cluster0.wtqnueb.mongodb.net/mongo-sessions?retryWrites=true&w=majority'}),
    secret: 'claveDude',
    resave: true,
    saveUninitialized: true,
    cookie: { maxAge: 600000 }
})
)

mainRouter.use(cookieParser('parserDude'))

//------- ROUTER --------

mainRouter.get('/', (req, res) => {
    console.log(req.session)
    
    db.then( _ => productModel.find())
    .then( resp => {
        let productList = resp
        let logName = ''

        if (req.session.logName) {
            logName = req.session.logName;
        }

        res.render('index', { productList, logName });
    })
})

mainRouter.get('/login', (req, res) => {
    res.render('login')
})

mainRouter.post('/login', (req, res) => {
    req.session.logName = req.body.name;
    res.redirect('/');
})

mainRouter.get('/logout', (req, res) => {

    req.session.destroy( err => {
        if(err) {
            res.render('error', { message: err.message })
        }
    })
    res.redirect('/');
})

module.exports = mainRouter