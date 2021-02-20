const nodemailer = require('nodemailer')
const hbs = require('nodemailer-express-handlebars')

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'bookingcloneapi@gmail.com',
    pass: 'BOOKINGcloneAPI',
  },
})

const options = {
  viewEngine: {
    layoutsDir: __dirname + '/views',
    extname: '.hbs',
  },
  extName: '.hbs',
  viewPath: 'services/email/views',
}

transporter.use('compile', hbs(options))

const emailSend = (to, subject, template) => {
  const mailOptions = {
    from: 'bookingcloneapi@gmail.com',
    to: to,
    subject: subject,
    template: template,
    context: {
      username: 'testUser',
    },
  }

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error)
    } else {
      console.log('Email sent: ' + info.response)
    }
  })
}