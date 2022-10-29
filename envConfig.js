const envConfig = {
    port: process.env.PORT || '8081',
    mongo_pass: process.env.MONGO_ATLAS_PASS,
    session_max: process.env.SESSION_MAX || 600000,
    jwt_secret: process.env.JWT_SECRET
}

module.exports = envConfig

