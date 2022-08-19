
//-------- Dependencies --------
const dotenv = require('dotenv').config();
const envConfig = require('./envConfig');
const argv = require('./argsConfig');

const express = require('express');
const compression = require('compression')
const { Server: IOServer } = require('socket.io');
const { Server: HttpServer } = require('http');
const fs = require('fs');


//------- Modules --------
const mainRouter = require('./routers/mainRouter.js');
const chatRouter = require('./routers/chatRouter.js');
const cartRouter = require('./routers/cartRouter.js');
const adminRouter = require('./routers/adminRouter.js');
const randomRouter = require('./routers/randomRouter.js');

// const { initSetup } = require('./db/setup/dbSetup.js');
// const knex = require('knex')( initSetup );

const { initSetupLite } = require('./db/setup/dbsqliteSetup.js');
const knexLite = require('knex')( initSetupLite );

//------- APP -------
const app = express();
const httpServer = new HttpServer(app);
const io = new IOServer(httpServer);

const PORT = argv.port;

//-------- Template Generator --------

app.set('view engine', 'ejs');
app.set('views', './views');

//------- Middlewares ---------

app.use(compression())

app.use(express.json());
app.use(express.urlencoded( { extended: true }));

app.use('/', mainRouter);
app.use('/chat', chatRouter);
app.use('/cart', cartRouter);
app.use('/admin', adminRouter);
app.use('/random', randomRouter);
app.use(express.static('./public'));




//Error handler in the application! (no adddres required so it can cath any error)

// app.use((err, req, res, next) => {
//     return res.render('error');
// })


//-------- App req res --------

httpServer.listen(PORT, () => { console.log(`Server ready and listening on port ${PORT}.`)}).on( 'err', err => { console.error(`Error in the server: \n { ${{err}}`)})



io.on('connection', socket => {
    console.log('New Connection');

    knexLite.from('messages').select('*')
        .then( resp => {
            for ( msg of resp) {
                socket.emit('myMessage', msg);}
        })

    socket.on('recover-msg', incoming =>{
        if (incoming == true) {

            knexLite.from('messages').select('*')
                .then( resp => {
                    for (msg of resp) {
                        socket.emit('recover-msg', msg);
                    }       
                })
        }
    })

    // io.sockets.emit('newUser', `New user connected ${socket.id}`)
    socket.emit('indexSocket', 'Index Socket Connected');
    socket.on('indexSocket', incoming => {
        console.log(incoming);
    })

    socket.emit('productsSocket', 'Products Socket Connected');
    socket.on('productsSocket', incoming => {
        console.log(incoming);
    })

    socket.emit('chatSocket', 'Chat Socket Connected');
    socket.on('chatSocket', incoming => {
        console.log(`${incoming}-socket connected`);
    })

    socket.on('message', incoming => {
        let time = new Date();    

        let message = incoming;

        message.date = time.toLocaleString();

        knexLite('messages')
            .insert(message)

        socket.emit('myMessage', message);
        socket.broadcast.emit('message', message);
    })

    // -------- Product Refresh --------
    socket.on('productRefresh', (incoming) => {
        console.log('Recibo el aviso de product refresh en el server: ', incoming);        
        socket.broadcast.emit('refresList', true);
    })
})

