const express = require("express");
const { Router } = express;
const CartModel = require("../operative/cartBuilder");
const ProductsMongo = require("../operative/productHandlerMongo");
const session = require("express-session");
const { TEST_MAIL, transporter } = require("../misc/nodeMailerConfig");

const db = require("../db/mongo/db");
const productModel = require("../db/mongo/models/productsModel");
const userModel = require("../db/mongo/models/userModel");
const envConfig = require("../envConfig");

const cartRouter = Router();

const cart = new CartModel(db, userModel);
const productsMongo = new ProductsMongo(db, productModel);
const MongoStore = require("connect-mongo");

// -------- SESSION --------

cartRouter.use(
  session({
    store: MongoStore.create({
      mongoUrl: `mongodb+srv://AZL:${envConfig.mongo_pass}@cluster0.wtqnueb.mongodb.net/mongo-sessions?retryWrites=true&w=majority`,
    }),
    secret: "claveDude",
    resave: true,
    saveUninitialized: true,
    cookie: { maxAge: 600000 },
  })
);

// --------- ENDPOINTS ---------

cartRouter.get("", (req, res) => {
  return res.redirect("cart/products");
});

cartRouter.get("/products", (req, res) => {
  let cartAmount = 0;
  let logName = "";
  let avatarDir = "";

  if (req.user && req.user.alias) {
    logName = req.user.alias;
    avatarDir = req.user.avatar;
  }

  if (!req.user) {
    return res.render("error", {
      message: "You should be logged before adding stuff",
    });
  }

  return cart.getAllCart(req.user._id).then((resp) => {
    let cartListRender = [];
    let cartList = [];

    resp.forEach((item) => {
      cartList.push(item.product_Id);
    });
    (async () => {
      cartListRender = await productsMongo.getMany(cartList);
      for (let item of cartListRender) {
        for (let item2 of resp) {
          if (item._id == item2.product_Id) {
            item.qty = item2.qty;
          }
        }
      }

      cartListRender.forEach((item) => {
        cartAmount += item.price * item.qty;
      });

      cartAmount.toFixed(2);

      res.render("cartList", {
        cartListRender,
        cartAmount,
        logName,
        avatarDir,
      });
    })();
  });
});

cartRouter.post("/products/:id", (req, res) => {
  let userId = req.user._id;
  let idp = {
    product_Id: req.params.id,
    qty: 1,
  };

  if (!req.user) {
    return null;
  }

  return cart.itemCheck(userId, req.params.id).then((resp) => {
    if (resp === undefined) {
      return cart.addProduct(userId, idp);
    } else {
      return cart.addQty(userId, idp.product_Id);
    }
  });
});

cartRouter.delete("/products/:id", (req, res) => {
  return cart.deleteById(req.user._id, req.params.id).then((resp) => {});
});

cartRouter.post("/buynow/:buy", (req, res) => {
  return cart.getAllCart(req.user._id).then((resp) => {
    let cartList = [];
    let cartListOrder = [];
    let cartAmount = 0;
    let orderPlaced = {
      orderNumber: req.user.orders.length + 1,
      order: resp,
      date: new Date().toDateString(),
      state: "placed",
    };

    resp.forEach((item) => {
      cartList.push(item.product_Id);
    });

    return productsMongo.getMany(cartList).then(resp2 => {
      for (let item of resp2) {
        for (let item2 of resp) {
          if (item._id == item2.product_Id) {
            item.qty = item2.qty;
          }
        }
      }

      cartListOrder.forEach((item) => {
        cartAmount += item.price * item.qty;
      });

      
      const mailOptions = {
        from: TEST_MAIL,
        to: req.user.username,
        subject: `Nuevo pedido de ${req.user.alias} - ${req.user.username}`,
        html: `
              <h1>Congrats in your new purchase! ${req.user.username} - ${req.user.alias}</h1>
  
              <p>You purchase will arrive at the given address during your registration</p>
  
              <p>The order is:</p>
                <p>Order Number: ${orderPlaced.orderNumber}</p>
                <p>Items: <ul>${resp2.map(item => `<li>${item.title} - USD$${item.price}</li>`)}</ul></p>
                <p>Date: ${orderPlaced.date}</p>
                <p>State: ${orderPlaced.state}</p>
              `,
      };

      const sendMail = async () => {
        try {
          const response = await transporter.sendMail(mailOptions);
          console.log(response);
          return res.render("success", {
            message: `You will receive a confirmation email at ${req.user.username}`,
          });
        } catch (e) {
          console.error(e);
        }
      };
  
      sendMail();

      return cart.saveOrder(req.user._id, orderPlaced);

    })

  });
});

module.exports = cartRouter;
