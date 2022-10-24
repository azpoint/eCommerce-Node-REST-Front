const { initSetupLite } = require("../db/setup/dbsqliteSetup.js");
const knexLite = require("knex")(initSetupLite);


const mainSocket = (socket) => {
    console.log("New Connection");
  
    knexLite
      .from("messages")
      .select("*")
      .then((resp) => {
        for (msg of resp) {
          socket.emit("myMessage", msg);
        }
      });
  
    socket.on("recover-msg", (incoming) => {
      if (incoming == true) {
        knexLite
          .from("messages")
          .select("*")
          .then((resp) => {
            for (msg of resp) {
              socket.emit("recover-msg", msg);
            }
          });
      }
    });
  
    // io.sockets.emit('newUser', `New user connected ${socket.id}`)
    socket.emit("indexSocket", "Index Socket Connected");
    socket.on("indexSocket", (incoming) => {
      console.log(incoming);
    });
  
    socket.emit("productsSocket", "Products Socket Connected");
    socket.on("productsSocket", (incoming) => {
      console.log(incoming);
    });
  
    socket.emit("chatSocket", "Chat Socket Connected");
    socket.on("chatSocket", (incoming) => {
      console.log(`${incoming}-socket connected`);
    });
  
    socket.on("message", (incoming) => {
      let time = new Date();
  
      let message = incoming;
  
      message.date = time.toLocaleString();
  
      knexLite("messages").insert(message);
  
      socket.emit("myMessage", message);
      socket.broadcast.emit("message", message);
    });
  
    // -------- Product Refresh --------
    socket.on("productRefresh", (incoming) => {
      console.log("Recibo el aviso de product refresh en el server: ", incoming);
      socket.broadcast.emit("refresList", true);
    });
  }

  module.exports = mainSocket;