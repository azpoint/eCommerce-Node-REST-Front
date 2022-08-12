const express = require('express');
const { Router } = express;
const { fork } = require('child_process');
const os = require('os');

const randomRouter = Router();

randomRouter.get('/', (req, res) => {
    const calc = fork('./misc/calc.js')
    calc.on('message', resp => {
        return res.json({
            result: `The answer to the calc process is: ${resp}`,
            numberCPUs: os.cpus().length
        })
    })
})

module.exports = randomRouter