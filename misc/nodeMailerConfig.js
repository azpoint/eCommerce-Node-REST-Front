const envConfig = require("../envConfig");
const nodemailer = require('nodemailer');

const systemMail = envConfig.system_mail

const transporter = nodemailer.createTransport({
    // ---- envConfig.system_mail_host | Esta variable no funciona y rompe la app 
    host: 'smtp.ethereal.email',
    // ---- envConfig.system_mail_port | Esta variable no funciona y rompe la app 
    port: 587,
    auth: {
        user: systemMail,
        pass: envConfig.system_mail_pass
    }
});

module.exports = { systemMail, transporter }