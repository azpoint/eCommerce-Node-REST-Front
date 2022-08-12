const envConfig = {
    host: process.env.HOST || 'localhost',
    mongo_pass: process.env.MONGO_ATLAS_PASS
}

module.exports = envConfig