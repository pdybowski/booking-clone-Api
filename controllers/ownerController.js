const mongoose = require('mongoose')
const ApiError = require('../helpers/apiError')
const { addRoom } = require('../services/ownerService')

exports.addRoom = async (req, res, next) => {
  try {
    const room = await addRoom(req)
    res.status(200).send(room)
  } catch (error) {
    next(new ApiError(400, 'Can not add a room.'))
  }
}
