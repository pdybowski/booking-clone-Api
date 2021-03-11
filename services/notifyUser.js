const { sendSms } = require('./sms/index')
const { sendMail } = require('./email/index')

function notifyUser(
  user,
  subjectEmail,
  viewEmail,
  hotelName,
  from,
  textSms
) {
  const { isSmsAllowed, email, phoneNumber } = user
  sendMail(email, subjectEmail, viewEmail, user.fullName, hotelName)
  if (isSmsAllowed) {
    sendSms(from, phoneNumber, textSms)
  }
}

module.exports = {
  notifyUser,
}
