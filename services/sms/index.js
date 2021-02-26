const Nexmo = require('nexmo')
const config = require('config')

const smsAPI = config.get('sms.API')
const smsPass = config.get('sms.pass')

const nexmo = new Nexmo({
  apiKey: smsAPI,
  apiSecret: smsPass,
})

const sendSms = (from, number, text) => {
  nexmo.message.sendSms(from, number, text)
}

//number format - 48111222333

module.exports = {
  sendSms: sendSms,
}
