const mongoose = require('mongoose')
const Reservation = require('../models/reservation')
const { hotelExists, roomExists, numberOfGuestsInRoom } = require('./hotel')
const ApiError = require('../helpers/apiError')

const isRoomAvailable = async (hotelId, roomId, startDate, endDate) => {
  return !(await Reservation.exists({
    hotelId,
    roomId,
    $or: [
      { startDate: { $gte: startDate, $lt: endDate } },
      { endDate: { $gt: startDate, $lte: endDate } },
    ],
  }))
}

const getReservations = async (user) => {
  const reservations = await Reservation.find({ userId: user._id })
  return reservations
}

const saveReservation = async (user, data) => {
  if (user.isStandardUser) {
    if (!user._id.equals(mongoose.Types.ObjectId(data.userId))) {
      throw new ApiError(403, 'You are not allowed to create a reservation.')
    }
  }

  const { hotelId, roomId, people, startDate, endDate } = data

  if (!(await hotelExists(hotelId))) {
    return false
  }

  if (!(await roomExists(hotelId, roomId))) {
    return false
  }

  if (!(await isRoomAvailable(hotelId, roomId, startDate, endDate))) {
    return false
  }

  const guests = await numberOfGuestsInRoom(hotelId, roomId)
  const numberOfPersons = +people.adults + +people.children

  if (numberOfPersons > guests) {
    return false
  }

  const reservation = new Reservation(data)
  await reservation.save()

  return true
}

module.exports = {
  getReservations,
  saveReservation,
  isRoomAvailable,
}
