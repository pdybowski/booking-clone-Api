const ApiError = require('../helpers/apiError')
const User = require('../models/user')
const Reservation = require('../models/reservation')
const { Hotel } = require('../models/hotel')

exports.getUsers = async (userRole, hotelOwnerRole) => {
  const users = await User.find({ role: { $in: [userRole, hotelOwnerRole] } })

  return users
}

exports.getHotelOwners = async (role) => {
  const owners = await User.find({ role: role })

  return owners
}

exports.acceptUserToOwner = async (id, role) => {
  const user = await User.updateOne({ _id: id }, { role: role })

  if (!user) {
    throw new ApiError(400, 'User not found')
  }

  return user
}

exports.deleteOwner = async (id, role) => {
  const user = await User.findOneAndDelete({
    _id: id,
    role: role,
  })

  if (!user) {
    throw new ApiError(400, 'Wrong ID or user is not a hotel owner')
  }

  return user
}

exports.deleteUser = async (id, role) => {
  const user = await User.findOneAndDelete({
    _id: id,
    role: role,
  })
  if (!user) {
    throw new ApiError(400, 'Wrong ID')
  }
}

exports.deleteUsers = async (users, isForceDelete) => {
  for (const id of users) {
    const user = await User.findById(id)
    if (!user) {
      throw new ApiError(400, 'User not found')
    }
    const reservation = await Reservation.find({ user: id })
    if (reservation.length > 0 && isForceDelete) {
      await Reservation.deleteMany({ user: id })
    }
    if (reservation.length > 0 && !isForceDelete) {
      throw new ApiError(400, 'Remove reservations first')
    }
    await User.findByIdAndDelete(id)
  }
}

exports.deleteHotel = async (hotelId, isForceDelete) => {
  const reservation = await Reservation.find({ hotel: hotelId })
  const hotel = await Hotel.findById(hotelId)
  if (!hotel) {
    throw new ApiError(400, 'Hotel not found')
  }
  console.log(reservation)
  if (reservation.length > 0 && isForceDelete) {
    await Reservation.deleteMany({ hotel: hotelId })
    await Hotel.findByIdAndDelete(hotelId)
    //sms
  }
  if (reservation.length > 0 && !isForceDelete) {
    console.log('se')
    throw new ApiError(400, 'Remove reservation first')
  }
  await Hotel.findByIdAndDelete(hotelId)
}

exports.verifyUser = async (id) => {
  const user = await User.findOneAndUpdate({ _id: id }, { isVerified: true })
  if (!user) {
    throw new ApiError(400, 'User not found')
  }
}
