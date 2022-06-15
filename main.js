//-------- Dependencies --------
const express = require('express');
const { Server: IOServer } = require('socket.io');
const { Server: HttpServer } = require('http');
const fs = require('fs');

//------- Modules --------
const chatRouter = require('./routers/chatRouter.js');
const cartRouter = require('./routers/cartRouter.js');
const adminRouter = require('./routers/adminRouter.js');

// -------- DB --------
const { initSetup } = require('./db/setup/dbSetup.js');
const knex = require('knex')( initSetup );

//------- APP -------
const app = express();
const httpServer = new HttpServer(app);
const io = new IOServer(httpServer);

const PORT = 8080;

//-------- Template Generator --------

app.set('view engine', 'ejs');
app.set('views', './views');

//------- Middlewares ---------

app.use(express.json());
app.use(express.urlencoded( { extended: true }));

app.use('/api/chat', chatRouter);
app.use('/api/cart', cartRouter);
app.use('/api/admin', adminRouter);
app.use(express.static('./public'));

//Error handler in the application! (no adddres required so it can cath any error)

// app.use((err, req, res, next) => {
//     return res.render('error');
// })



//-------- App req res --------

httpServer.listen(PORT, () => { console.log(`Server ready and listening on port ${PORT}.`)}).on( 'err', err => { console.error(`Error in the server: \n { ${{err}}`)})

app.get('/', (req, res) => {
    knex.from('products').select('*').then( resp => {
        let productList = resp;
        res.render('index', { productList })
    })
})

let messages = [];

messages = JSON.parse(fs.readFileSync('./db/chatMessages.json'));

io.on('connection', socket => {
    console.log('New Connection');
    
    if (messages == []) {
        null;
    } else {
        console.log('Recovering Messages...')
        for ( msg of messages) {
            socket.emit('myMessage', msg);
        }
    }

    socket.on('recover-msg', incoming =>{
        if (incoming == true) {
            for (msg of messages) {
                socket.emit('recover-msg', msg)
            }
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

        messages.push(message);
        console.log(messages);

        // fs.promises.writeFile('./db/chatmessages.json', JSON.stringify(messages))
        // .catch( error => console.error(error));

        socket.emit('myMessage', message);
        socket.broadcast.emit('message', message);
    })

    // -------- Product Refresh --------
    socket.on('productRefresh', (incoming) => {
        console.log('Recibo el aviso de product refresh en el server: ', incoming);        
        socket.broadcast.emit('refresList', true);
    })
})

