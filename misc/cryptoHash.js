const bCrypt = require('bcrypt');

const createHash = (password) => {
    return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null)
}

const passwordValidation = (dbPassword, enteredPassword) => {
    return bCrypt.compareSync(enteredPassword, dbPassword)
}

module.exports = { createHash, passwordValidation }