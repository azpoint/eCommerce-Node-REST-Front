const envConfig = {
    port: process.env.PORT || '8080',
    mongo_pass: process.env.MONGO_ATLAS_PASS,
    session_max: process.env.SESSION_MAX || 600000,
    jwt_secret: process.env.JWT_SECRET,
    system_mail: process.env.SYSTEM_MAIL,
    system_mail_pass: process.env.SYSTEM_MAIL_PASS,
    system_mail_port: process.env.SYSTEM_MAIL_PORT,
    system_mail_host: process.env.SYSTEM_MAIL_HOST,
}

module.exports = envConfig

