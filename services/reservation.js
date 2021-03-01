const mongoose = require('mongoose')
const Reservation = require('../models/reservation')
const { hotelExists, roomExists } = require('./hotel')
const ApiError = require('../helpers/apiError')

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

  const { hotelId, roomId } = data

  if (!(await hotelExists(hotelId))) {
    return false
  }

  if (!(await roomExists(hotelId, roomId))) {
    return false
  }

  const reservation = new Reservation(data)
  await reservation.save()

  return true
}

module.exports = {
  getReservations,
  saveReservation,
}
