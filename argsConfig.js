const parseArgs = require('minimist')

const options = {
    default: {
        port: 8080
    }
}

module.exports = parseArgs(process.argv.slice(2), options)