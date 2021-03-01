const { Hotel } = require('../models/hotel')

const hotelExists = async (hotelId) => {
  return await Hotel.exists({ _id: hotelId })
}

const roomExists = async (hotelId, roomId) => {
  return await Hotel.exists({ _id: hotelId, 'rooms._id': roomId })
}

module.exports = {
  hotelExists,
  roomExists,
}
