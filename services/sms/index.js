const Nexmo = require('nexmo')

const nexmo = new Nexmo({
    apiKey: 'e5c1a352',
    apiSecret: 'nD9CM2Hf3qjvzVZE',
  });

const smsSend = (from, number, text) => {
    nexmo.message.sendSms(from, number, text)
}

//number format - 48111222333