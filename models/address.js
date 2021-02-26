const Joi = require('joi')
const mongoose = require('mongoose')

const adressSchema = new mongoose.Schema({
  country: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  zipcode: {
    type: Number,
    required: true,
  },
  street: {
    type: String,
    required: true,
  },
  buildingNumber: {
    type: Number,
    required: true,
  },
})

const Address = mongoose.model('Address', adressSchema)

const validateAddress = (address) => {
  const schema = Joi.object({
    country: Joi.string().min(0).required(),
    city: Joi.string().min(0).required(),
    zipcode: Joi.number.min(0).required(),
    street: Joi.string().min(0).required(),
    buildingNumber: Joi.number.min(1).required(),
  })

  return schema.validate(address)
}

exports.Address = Address
exports.validate = validateAddress
