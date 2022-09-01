const { createTransport } = require('nodemailer')

const TEST_MAIL = 'columbus61@ethereal.email'
const TEST_PASSWORD = 'ysGZewUB919tYV8sHe'

const transporter = createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
        user: TEST_MAIL,
        pass: TEST_PASSWORD
    }
});

module.exports = { TEST_MAIL, TEST_PASSWORD, transporter }