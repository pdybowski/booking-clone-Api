const ApiError = require('../helpers/apiError')
const { Hotel } = require('../models/hotel')
const { Reservation } = require('../models/reservation')

exports.getFreeRooms = async (req) => {
  if (!req.query.startDate || !req.query.endDate)
    throw new ApiError(400, 'Provide start date and end date.')

  const { hotelId } = req.params
  const { startDate, endDate } = req.query

  const hotel = await Hotel.findById(hotelId)
  if(!hotel) throw new ApiError(404, 'Hotel not found')

  const freeRooms = []
  const rooms = hotel.rooms

  for(const room of rooms) {
    const roomReservations = await Reservation.find({ room: room._id })
    if (roomReservations.length == 0) {
      freeRooms.push(room)
    } else {
      const occupiedRR = roomReservations.some(rr => (rr.startDate.toISOString() <= startDate && rr.endDate.toISOString() > startDate) || (rr.startDate.toISOString() < endDate && rr.endDate.toISOString() >= endDate))
      if (!occupiedRR) freeRooms.push(room)
    }
  }
  return freeRooms
}