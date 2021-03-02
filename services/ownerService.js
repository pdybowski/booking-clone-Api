const mongoose = require('mongoose')
const { Hotel } = require('../models/hotel')
const { validateRoom } = require('../validations/room')

exports.addRoom = async (req) => {
  const { error } = validateRoom(req.body)
  if (error) throw new ApiError(400, error.details[0].message)

  const hotel = await Hotel.find({ _id: req.params.hotelId })
  if (!hotel) throw new ApiError(400, 'Hotel with provided ID was not found.')

  const { beds, price, description, name } = req.body

  const room = {
    _id: new mongoose.Types.ObjectId(),
    hotelId: req.params.hotelId,
    name: name,
    beds: beds,
    price: price,
    description: description,
  }

  await Hotel.updateOne({ $push: { rooms: room } })

  return room
}
