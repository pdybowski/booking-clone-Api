const ApiError = require('../helpers/apiError')
const Hotel = require('../models/hotel')
const Reservation = require('../models/reservation')

exports.getFreeRooms = async (req) => {
  if (!req.query.startDate || !req.query.endDate)
    throw new ApiError(400, 'Provide start date and end date.')

  const { hotelId } = req.params
  const { startDate, endDate } = req.query

  const freeRooms = []

  const rooms = await Hotel.find({ _id: hotelId }).rooms

  rooms.forEach(async (room) => {
    const roomReservations = await Reservation.find({ roomId: room._id })
    if (roomReservations.count() == 0) return freeRooms.push(room)

    const occupiedRR = await roomReservations.find({
      $or: [
        {
          startDate: { $and: [{ $gte: startDate }, { $lte: endDate }] },
          endDate: { $and: [{ $lte: endDate }, { $gte: startDate }] },
        },
      ],
    })

    if (occupiedRR.count() === 0) return freeRooms.push(room)
  })

  return freeRooms
}
