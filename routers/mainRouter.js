const express = require('express');
const { Router } = express;
const session = require('express-session');
const passport = require('passport');
const { Strategy: LocalStrategy } = require('passport-local');
const cookieParser = require('cookie-parser');

const mainRouter = Router();
// -------- DB --------

const db = require('../db/mongo/db')
const productModel = require('../db/mongo/models/productsModel');
const userModel = require('../db/mongo/models/userModel')
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

mainRouter.use(passport.initialize());
mainRouter.use(passport.session());

mainRouter.use(cookieParser('parserDude'))



// -------- PASSPORT --------

passport.use('signup', new LocalStrategy({ passReqToCallback: true }, (req, username, password, done) => {
    return userModel.findOne({ username })
        .then( user => {
            if(user) {
                return done(null, false, { message: 'User already exist' })
            }

            const newUser = new User()
            newUser.username = username
            newUser.password = createHash(password)
            newUser.email = req.body.email
        })
}))

//------- ROUTER --------

mainRouter.get('/', (req, res) => {
    
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

mainRouter.get('/signup', (req, res) => {
    res.render('signup')
})

mainRouter.post('/signup', (req, res, next) => {
    console.log(req.body)
    next()
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