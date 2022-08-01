const express = require('express');
const { Router } = express;


const chatRouter = Router();


chatRouter.get('/chatAdmin', (req, res) => {
    let logName = ''
    
    if (req.session.logName) {
        logName = req.session.alias
    }
    
    return res.render("adminChat", { logName });  
})

module.exports = chatRouter