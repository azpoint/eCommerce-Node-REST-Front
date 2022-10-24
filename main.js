//-------- DEPENDENCIES --------
const dotenv = require("dotenv").config();
const envConfig = require("./envConfig");

const express = require("express");
const compression = require("compression");
const { Server: IOServer } = require("socket.io");
const { Server: HttpServer } = require("http");

//------- MODULES --------
const mainRouter = require("./routers/mainRouter.js");
const chatRouter = require("./routers/chatRouter.js");
const cartRouter = require("./routers/cartRouter.js");
const adminRouter = require("./routers/adminRouter.js");
const randomRouter = require("./routers/randomRouter.js");
const mainSocket = require("./operative/socketIO.js");
const apiRouter = require("./routers/apiRouterCRUD.js");
const apiRouterCart = require("./routers/apiRouterCart.js");

//------- APP -------
const app = express();
const httpServer = new HttpServer(app);
const io = new IOServer(httpServer);
const PORT = envConfig.port;

//-------- TEMPLATE GENERATOR --------
app.set("view engine", "ejs");
app.set("views", "./views");

//------- MIDDLEWARES ---------
app.use(compression());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/", mainRouter);
app.use("/chat", chatRouter);
app.use("/cart", cartRouter);
app.use("/admin", adminRouter);
app.use("/random", randomRouter);
app.use("/api/productos", apiRouter);
app.use("/api/carrito", apiRouterCart);
app.use(express.static("./public"));


//Error handler in the application! (no adddres required so it can cath any error)

// app.use((err, req, res, next) => {
//     return res.render('error', {message: err.message});
// })

//-------- APP LISTEN --------
httpServer
  .listen(PORT, () => {
    console.log(`Server ready and listening on port ${PORT}.`);
  })
  .on("err", (err) => {
    console.error(`Error in the server: \n { ${{ err }}`);
  });

io.on("connection", mainSocket);
