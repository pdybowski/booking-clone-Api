const Joi = require('joi')
Joi.objectId = require('joi-objectid')(Joi)
const { validateRequest } = require('../helpers/validationError')

module.exports = function validateResetPassword(req, res, next) {
  const schema = Joi.object({
    userId: Joi.objectId().required().label('User Id'),
    token: Joi.string().required().label('Token'),
    password: Joi.string().min(8).max(30).required().label('Password'),
  })

  validateRequest(req, next, schema)
}
