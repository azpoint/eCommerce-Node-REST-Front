const express = require('express');
const { Router } = express;


const chatRouter = Router();


chatRouter.get('/chatAdmin', (req, res, next) => {
    res.render("adminChat");
})

module.exports = chatRouter