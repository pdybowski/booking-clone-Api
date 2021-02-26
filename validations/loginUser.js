const Joi = require('joi')
const { validateData } = require('./validateData')

module.exports = function validateLoginUser(data) {
  const schema = Joi.object({
    email: Joi.string().max(255).email().required().label('Email'),
    password: Joi.string().min(8).max(30).required().label('Password'),
  })

  return validateData(data, schema)
}
