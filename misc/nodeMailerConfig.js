const nodemailer = require('nodemailer')

const TEST_MAIL = 'maida.goyette41@ethereal.email'
const TEST_PASSWORD = 'U3wb7Fj85kjCmAspCH'

const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
        user: 'maida.goyette41@ethereal.email',
        pass: 'U3wb7Fj85kjCmAspCH'
    }
});

module.exports = { TEST_MAIL, TEST_PASSWORD, transporter }