const { Hotel } = require('../models/hotel')

const hotelExists = async (hotelId) => {
  return await Hotel.exists({ _id: hotelId })
}

const roomExists = async (hotelId, roomId) => {
  return await Hotel.exists({ _id: hotelId, 'rooms._id': roomId })
}

const numberOfGuestsInRoom = async (hotelId, roomId) => {
  const hotel = await Hotel.findOne({ _id: hotelId, 'rooms._id': roomId })
  const room = hotel.rooms.id(roomId)

  return room.beds.single + 2 * room.beds.double
}

const getHotelIdsForOwner = async (hotelOwnerId) => {
  return await Hotel.find({ ownerId: hotelOwnerId }).distinct('_id')
}

module.exports = {
  hotelExists,
  roomExists,
  numberOfGuestsInRoom,
  getHotelIdsForOwner,
}
