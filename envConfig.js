const envConfig = {
    host: process.env.HOST || 'localhost',
    port: Number(process.env.PORT) || 8080,
    mongo_pass: process.env.MONGO_ATLAS_PASS
}

module.exports = envConfig