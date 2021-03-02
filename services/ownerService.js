const { Hotel, validate } = require('../models/hotel')
const { Room, validateRoom } = require('../models/room')

exports.addRoom = async (req) => {
  const { error } = validateRoom(req.body)
  if (error) throw new ApiError(400, error.details[0].message)

  const hotel = await Hotel.find({ _id: req.params.hotelId })
  if (!hotel) throw new ApiError(400, 'Hotel with provided ID was not found.')

  const room = new Room(req.body)

  await room.save()
  await Hotel.updateOne({ $push: { rooms: room } })

  return room
}
