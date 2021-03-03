const ApiError = require('../helpers/apiError')
const User = require('../models/user')
const Reservation = require('../models/reservation')

exports.getUsers = async (userRole, hotelOwnerRole) => {
  const users = await User.find({ role: { $in: [userRole, hotelOwnerRole] } })

  return users
}

exports.getHotelOwners = async (role) => {
  const owners = await User.find({ role: role })

  return owners
}

exports.acceptOwnersEmail = async (id, role) => {
  const user = await User.updateOne({ _id: id }, { role: role })

  if (!user) {
    throw new ApiError(404, 'User not found')
  }

  return user
}

exports.deleteOwner = async (id, role) => {
  const user = await User.findOneAndDelete({
    _id: id,
    role: role,
  })

  if (!user) {
    throw new ApiError(404, 'Wrong email or user is not a hotel owner')
  }

  return user
}

exports.deleteUser = async (id, role) => {
  const user = await User.findOneAndDelete({
    _id: id,
    role: role,
  })
  if (!user) {
    throw new ApiError(400, 'Wrong email')
  }
}

exports.deleteUsers = async (users, force) => {
  const isForceDelete = force === 'true'
  const usersWithReservation = []

  await users.map(async (id) => {
    const reservation = await Reservation.find({ userId: id })

    if (reservation.length > 0 && isForceDelete) {
      await Reservation.deleteMany({ userId: id })
    }

    if (reservation.length > 0 && !isForceDelete) {
      usersWithReservation.push(id)
      throw new ApiError(400, 'Remove reservations first')
    }
    await User.findByIdAndDelete(id)
  })
}

exports.deleteHotel = async (hotelId, force) => {
  const isForceDelete = force === 'true'
  const reservation = await Reservation.find({ hotelId: hotelId })
  if (reservation.length > 0 && isForceDelete) {
    await Reservation.deleteMany(hotelId)
    await Hotel.findByIdAndDelete(hotelId)
    //sms
  }
  if (reservation.length > 0 && !isForceDelete) {
    throw new ApiError(400, 'Remove reservation first')
  }
  await Hotel.findByIdAndDelete(hotelId)
}

exports.verifyUser = async (id) => {
  const user = await User.findOneAndUpdate({ _id: id }, { isVerified: true })
  if (!user) {
    throw new ApiError(400, "I didn't find such a user")
  }
}
