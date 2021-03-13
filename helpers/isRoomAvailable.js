const Reservation = require('../models/reservation')

isRoomAvailable = async (hotelId, roomId, startDate, endDate) => {
  return !(await Reservation.exists({
    hotel: hotelId,
    room: roomId,
    $or: [
      // start after startDate and after before endDate --- |
      {
        startDate: { $lt: startDate, $lt: endDate },
        endDate: { $gt: startDate, $lt: endDate },
      },
      // between some reservation time
      {
        startDate: { $lte: startDate, $lte: endDate },
        endDate: { $gte: startDate, $gte: endDate },
      },
      // start before startDate and end before endDate | ---
      {
        startDate: { $gt: startDate, $lt: endDate },
        endDate: { $gt: startDate, $lt: endDate },
      },
    ],
  }))
}

module.exports = isRoomAvailable
