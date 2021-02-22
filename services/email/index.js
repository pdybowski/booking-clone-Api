const nodemailer = require('nodemailer')
const handlebars = require('handlebars')
const fs = require('fs')
const path = require('path')

function emailSend(email, subject, view, username, hotel) {
  const filePath = path.join(__dirname, `./views/${view}.html`)
  const source = fs.readFileSync(filePath, 'utf-8').toString()
  const template = handlebars.compile(source)
  const replacements = {
    username: username,
    hotel: hotel
  }
  const htmlToSend = template(replacements)
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'bookingcloneapi@gmail.com',
      pass: 'BOOKINGcloneAPI',
    },
  })
  const mailOptions = {
    from: '"Booking Clone API" <bookingcloneapi@gmail.com>',
    to: email,
    subject: subject,
    html: htmlToSend,
  }
  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error)
    } else {
      console.log('Email sent: ' + info.response)
    }
  })
}