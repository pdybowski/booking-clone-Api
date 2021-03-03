const Joi = require('joi')
Joi.objectId = require('joi-objectid')(Joi)
const mongoose = require('mongoose')
const JoiPhoneNumer = Joi.extend(require('joi-phone-number'))
const { roomSchema } = require('./room')
const { clientRateSchema } = require('./rate')
const { addressSchema } = require('./address')

const hotelSchema = new mongoose.Schema({
  ownerId: {
    type: mongoose.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  localization: addressSchema,
  phoneNumber: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  clientsRates: [clientRateSchema],
  email: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  rooms: [roomSchema],
})

const Hotel = mongoose.model('Hotel', hotelSchema)

const validateHotel = (hotel) => {
  const schema = Joi.object({
    ownerId: Joi.objectId().required(),
    localization: Joi.object().required(),
    phoneNumber: JoiPhoneNumer.string().phoneNumber().required(),
    name: Joi.string().min(1).required(),
    clientsRate: Joi.array(),
    email: Joi.string().email().required(),
    description: Joi.string().min(0).required(),
    rooms: Joi.array().required(),
  })

  return schema.validate(hotel, { allowUnknown: true })
}

exports.validateHotel = validateHotel
exports.Hotel = Hotel
