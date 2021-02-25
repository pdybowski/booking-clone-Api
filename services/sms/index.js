const Nexmo = require('nexmo')
const { smsAPI, smsPass } = require('../../config/local.json')


const nexmo = new Nexmo({
    apiKey: smsAPI,
    apiSecret: smsPass,
  });

const smsSend = (from, number, text) => {
    nexmo.message.sendSms(from, number, text)
}

//number format - 48111222333