const express = require('express');
const { Router } = express;


const chatRouter = Router();


chatRouter.get('/chatAdmin', (req, res) => {
    let logName = ''
    let avatarDir = ''
    
    if (req.user && req.user.alias) {
        logName = req.user.alias
        avatarDir = req.user.avatar
    }
    
    return res.render("adminChat", { logName, avatarDir });  
})

module.exports = chatRouter