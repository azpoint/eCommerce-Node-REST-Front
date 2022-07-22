const express = require('express');
const { Router } = express;
const session = require('express-session');
const passport = require('passport');
const { Strategy: LocalStrategy } = require('passport-local');
const { createHash, passwordValidation } = require('../misc/cryptoHash');
const flash = require('connect-flash');
// const cookieParser = require('cookie-parser');

const mainRouter = Router();
// -------- DB --------

const db = require('../db/mongo/db')
const productModel = require('../db/mongo/models/productsModel');
const dbUser = require('../db/mongo/models/userModel');
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

mainRouter.use(flash());

mainRouter.use(passport.initialize());
mainRouter.use(passport.session());

// mainRouter.use(cookieParser('parserDude'))



// -------- PASSPORT --------

passport.use('login', new LocalStrategy({ passReqToCallback: true }, (req, username, password, done) => {

    return dbUser.findOne({ username })
        .then(userDb => {
            if(!user) {
                return done(null, false, { message: 'Wrong or inexistent user' })
            }

            if(!passwordValidation(userDb.password, password)) {
                return done(null, false, { message: 'Wrong password' })
            }

            req.session.alias = userDb.alias;

            console.log(userDb)
            
            return done(null, user)
        })
        .catch(err => done(err))
}))

passport.use('signup', new LocalStrategy({ passReqToCallback: true }, (req, username, password, done) => {
    return dbUser.findOne({ username })
        .then( userDb => {
            if(userDb) {
                return done(null, false, { message: 'User already exist, try another one' })
            }

            const newDbUser = new dbUser()
            
            newDbUser.username = username
            newDbUser.password = createHash(password)
            newDbUser.alias = req.body.alias

            if(req.body.isAdmin === 'on') {
                newDbUser.admin  = true
            } else {
                newDbUser.admin = false
            }

            return newDbUser.save()
                .then(user => {
                    return done(null, user)
                })
                .catch(err => done(err))
        })
}))


passport.serializeUser((user, done) => {
    console.log('Serialize User');
    done(null, user._id)
})

passport.deserializeUser((id, done) => {
    dbUser.findById(id)
        .then(user => {
        console.log('De-serialize User');

            done(null, user)
        })
})

//------- ROUTER --------

mainRouter.get('/', (req, res) => {
    
    db.then( _ => productModel.find())
    .then( resp => {
        let productList = resp
        let logName = ''

        if (req.session.alias) {
            logName = req.session.alias;
        }

        res.render('index', { productList, logName });
    })
})

mainRouter.get('/login', (req, res) => {
    return res.render('login', { message: req.flash('error') })
})

mainRouter.post('/login', passport.authenticate('login', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
}))

mainRouter.get('/signup', (req, res) => {
    return res.render('signup', { message: req.flash('error') })
})

mainRouter.post('/signup', passport.authenticate('signup', {
    successRedirect: '/',
    failureRedirect: '/signup',
    failureFlash: true
}))

mainRouter.get('/logout', (req, res) => {

    req.session.destroy( err => {
        if(err) {
            res.render('error', { message: err.message })
        }
    })
    res.redirect('/');
})

module.exports = mainRouter