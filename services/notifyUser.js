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
  console.log(user)
  const { isSmsAllowed, email, firstName, lastName, phoneNumber } = user
  const userFullName = `${firstName} ${lastName}`
  sendMail(email, subjectEmail, viewEmail, userFullName, hotelName)
  if (isSmsAllowed) {
    sendSms(from, phoneNumber, textSms)
  }
}

module.exports = {
  notifyUser,
}
