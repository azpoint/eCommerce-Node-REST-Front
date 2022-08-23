const envConfig = {
    port: process.env.PORT || '8081',
    mongo_pass: process.env.MONGO_ATLAS_PASS
}

module.exports = envConfig

