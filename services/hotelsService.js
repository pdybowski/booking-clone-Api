const ApiError = require('../helpers/apiError')
const { Hotel } = require('../models/hotel')

exports.getHotels = async () => {
  const hotels = await Hotel.find()

  return hotels
}

exports.getHotel = async (hotelId) => {
  const hotel = await Hotel.findById(hotelId)

  if (!hotel) {
    throw new ApiError(404, 'Hotel not found')
  }

  return hotel
}

exports.getLimitedHotels = async (limit) => {
  const hotels = await Hotel.find().limit(limit)

  return hotels
}

exports.getHotelsByCity = async (city) => {
  const hotels = await Hotel.find({ localization: { city: city } })

  return hotels
}

exports.hotelExists = async (hotelId) => {
  return await Hotel.exists({ _id: hotelId })
}

exports.roomExists = async (hotelId, roomId) => {
  return await Hotel.exists({ _id: hotelId, 'rooms._id': roomId })
}

exports.numberOfGuestsInRoom = async (hotelId, roomId) => {
  const hotel = await Hotel.findOne({ _id: hotelId, 'rooms._id': roomId })

  if (!hotel) {
    return 0
  }

  const room = hotel.rooms.id(roomId)

  return room.beds.single + 2 * room.beds.double
}

exports.getHotelIdsForOwner = async (hotelOwnerId) => {
  return await Hotel.find({ ownerId: hotelOwnerId }).distinct('_id')
}

exports.getHotelOwnerId = async (hotelId) => {
  const result = await Hotel.findOne({ _id: hotelId }).select('ownerId -_id')

  if (!result) {
    return null
  }

  return result.ownerId
}
