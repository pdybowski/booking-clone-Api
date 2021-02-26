const { smsSend } = require('../services/sms/index')
const { mailSend } = require('../services/email/index')

function notifyUser(
  userEmail,
  subjectEmail,
  viewEmail,
  userName,
  hotelName,
  from,
  number,
  textSms
) {
  mailSend(userEmail, subjectEmail, viewEmail, userName, hotelName)
  smsSend(from, number, textSms)
}

module.exports = {
  notifyUser,
}

notifyUser()
