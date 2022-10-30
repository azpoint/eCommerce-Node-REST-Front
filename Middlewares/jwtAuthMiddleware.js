const jwt = require('jsonwebtoken')

class AuthMiddleware {
    constructor (privateKey) {
        this.privateKey = privateKey
    }

    verifyToken (req, res, next) {

    const authToken = req.headers.authorization

    if(!authToken) {
        return res.status(401).json({ error: 'You need to send a JWT. Please do a weblog to get your API-REST-KEY'})
    }

    jwt.verify(authToken, this.privateKey, (err, payload) => {
        if(err) {
            return res.status(401).json({ error: 'You need a valid JWT' })
        }

        req.user = payload

        return next()
        })
    }
}

module.exports = AuthMiddleware;