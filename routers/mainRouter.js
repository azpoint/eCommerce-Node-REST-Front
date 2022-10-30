const envConfig = require("../envConfig");
const express = require("express");
const { Router } = express;
const session = require("express-session");
const passport = require("passport");
const { Strategy: LocalStrategy } = require("passport-local");
const { createHash, passwordValidation } = require("../misc/cryptoHash");
const flash = require("connect-flash");
const upload = require("../misc/uploadMiddleware");
const { v4: uuidv4 } = require("uuid");
const sharp = require("sharp");
const jwt = require('jsonwebtoken');

const mainRouter = Router();
// -------- DB --------

const db = require("../db/mongo/db");
const productModel = require("../db/mongo/models/productsModel");
const dbUser = require("../db/mongo/models/userModel");
const MongoStore = require("connect-mongo");

//--------Middlewares --------
mainRouter.use(session({
    store: MongoStore.create({
      mongoUrl: `mongodb+srv://AZL:${envConfig.mongo_pass}@cluster0.wtqnueb.mongodb.net/mongo-sessions?retryWrites=true&w=majority`,
    }),
    secret: "claveDude",
    resave: true,
    saveUninitialized: true,
    cookie: { maxAge: 600000 },
  })
);

mainRouter.use(flash());

mainRouter.use(passport.initialize());
mainRouter.use(passport.session());

// -------- PASSPORT --------

passport.use("login", new LocalStrategy({ passReqToCallback: true }, (req, username, password, done) => {

      return dbUser.findOne({ username })
        .then((user) => {
          if (!user) {
            return done(null, false, { message: "Wrong or inexistent user" });
          }

          if (!passwordValidation(user.password, password)) {
            return done(null, false, { message: "Wrong password" });
          }

          const jwtToken = jwt.sign({ id: user._id, username: user.username }, process.env.JWT_SECRET, { expiresIn: '24h'})

          user.token = jwtToken

          return user.save().then((user) => {
            console.log("Login Done");
            return done(null, user);
          })

        })
        .catch((err) => done(err));
    }
  )
);

passport.use("signup",new LocalStrategy({ passReqToCallback: true }, (req, username, password, done) => {

      if (!req.file) {
        return done(null, false, { message: "Please upload a picture" });
      }

      function getFileExtension(mimeType) {
        if (mimeType === "image/png") {
          return ".png";
        } else if (mimeType === "image/jpg") {
          return ".jpg";
        } else {
          return ".jpeg";
        }
      }

      return dbUser.findOne({ username }).then((userDb) => {
        if (userDb) {
          return done(null, false, {
            message: "User already exist, try another one",
          });
        }
        const avatarName = uuidv4();
        const newDbUser = new dbUser();

        sharp(req.file.buffer)
          .resize(300, 300)
          .toFile(
            `./public/avatars/${avatarName}${getFileExtension(
              req.file.mimetype
            )}`,
            (err) => console.log(err)
          );

        newDbUser.username = username;
        newDbUser.password = createHash(password);
        newDbUser.alias = req.body.alias;
        newDbUser.avatar = `${avatarName}${getFileExtension(
          req.file.mimetype
        )}`;
        newDbUser.phone = req.body.countryCode + req.body.phoneNumber;
        newDbUser.address = req.body.address;

        if (req.body.isAdmin === "on") {
          newDbUser.admin = true;
        } else {
          newDbUser.admin = false;
        }

        return newDbUser.save().then((user) => {
            console.log("Signup Done");
            return done(null, user);
          })
          .catch((err) => done(err));
      });
    }
  )
);

passport.serializeUser((user, done) => {
  console.log("Serialize User");
  done(null, user._id);
});

passport.deserializeUser((id, done) => {
  console.log("De-serialize User");
  dbUser.findById(id).then((user) => {
    done(null, user);
  });
});

//------- ROUTER --------

mainRouter.get("/", (req, res) => {
  
  db.then((_) => productModel.find()).then((resp) => {
    let productList = resp;
    let logName = "";
    let avatarDir = "";
    let userToken = '';

    if (req.user && req.user.alias) {
      logName = req.user.alias;
      avatarDir = req.user.avatar;
      userToken = req.user.token;
    }

    return res.render("index", { productList, logName, avatarDir, userToken });
  });
});

mainRouter.get("/login", (req, res) => {
  console.log(req.flash("error"));
  return res.render("login", { message: req.flash("error") });
});

mainRouter.post("/login", passport.authenticate("login", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true,
  })
);

mainRouter.get("/signup", (req, res) => {
  return res.render("signup", { message: req.flash("error") });
});

mainRouter.post("/signup", upload.single("avatar-image"), passport.authenticate("signup", {
    successRedirect: "/",
    failureRedirect: "/signup",
    failureFlash: true,
  })
);

mainRouter.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      res.render("error", { message: err.message });
    }
  });
  return res.redirect("/");
});

mainRouter.get("/info", (req, res) => {

  return res.render("info", {
    envConf: envConfig,
    OS: process.platform,
    NodeVersion: process.version,
    ReservedMemory: process.memoryUsage().rss,
    ExecPath: process.execPath,
    Process_id: process.pid,
    Working_dir: process.cwd(),
  })
});

module.exports = mainRouter;
