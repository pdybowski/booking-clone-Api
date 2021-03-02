const mongoose = require('mongoose')
const ApiError = require('../helpers/apiError')
const { getFreeRooms } = require('../services/hotelsService')

exports.getFreeRooms = async (req, res, next) => {
  try {
    const freeRooms = getFreeRooms(req)
    res.status(200).send(freeRooms)
  } catch (error) {
    next(new ApiError(400, 'Free room data can not be fetched.'))
  }
}
