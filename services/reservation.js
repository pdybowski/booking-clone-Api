const mongoose = require('mongoose')
const Reservation = require('../models/reservation')
const { Address } = require('../models/address')
const { hotelExists, roomExists, numberOfGuestsInRoom } = require('./hotel')
const { userExists } = require('./user')
const ApiError = require('../helpers/apiError')

const isRoomAvailable = async (hotelId, roomId, startDate, endDate) => {
  return !(await Reservation.exists({
    hotel: hotelId,
    room: roomId,
    $or: [
      { startDate: { $gte: startDate, $lt: endDate } },
      { endDate: { $gt: startDate, $lte: endDate } },
    ],
  }))
}

const getReservations = async (user) => {
  const reservations = await Reservation.find({ user: user._id })
    .select('-user')
    .populate({
      path: 'hotel',
      select: 'name localization rooms',
      populate: {
        path: 'localization',
        select: {
          _id: 0,
          country: 1,
          city: 1,
          zipcode: 1,
          street: 1,
          buildingNumber: 1,
        },
        model: Address,
      },
    })

  return reservations.map((reservation) => {
    const room = reservation.hotel.rooms.id(reservation.room)

    return {
      _id: reservation._id,
      startDate: reservation.startDate,
      endDate: reservation.endDate,
      people: reservation.people,
      hotel: {
        name: reservation.hotel.name,
        address: reservation.hotel.localization,
        room: {
          price: room.price,
          description: room.description,
        },
      },
    }
  })
}

const saveReservation = async (user, data) => {
  if (user.isAdmin) {
    if (!(await userExists(data.userId))) {
      return false
    }
  } else {
    if (!user._id.equals(mongoose.Types.ObjectId(data.user))) {
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
