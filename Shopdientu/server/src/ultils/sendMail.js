const nodemailer = require('nodemailer')
const asyncHandler = require('express-async-handler')

const sendMail = asyncHandler(async ({ email, html, subject }) => {
    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: process.env.EMAIL_NAME, // generated ethereal user
            pass: process.env.EMAIL_APP_PASSWORD, // generated ethereal password
        },
    });


    let info = await transporter.sendMail({
        from: '"Cuahangdientu" <no-relply@cuahangdientu.com>',
        to: email,
        subject: subject,
        html: html,
    });

    return info
})

module.exports = sendMail