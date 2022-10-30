const express = require("express");
const { Router } = express;

const chatRouter = Router();

chatRouter.get("/chatAdmin", (req, res) => {
  let logName = "";
  let avatarDir = "";
  let userToken = "";

  if (req.user && req.user.alias) {
    logName = req.user.alias;
    avatarDir = req.user.avatar;
    userToken = req.user.token;
  }

  return res.render("adminChat", { logName, avatarDir, userToken });
});

module.exports = chatRouter;
