const ApiError = require('../helpers/apiError')
const User = require('../models/user')

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

exports.verifyOwner = async (id) => {
  const user = await User.findOneAndUpdate({ _id: id }, { isVerified: true })
  if (!user) {
    throw new ApiError(400, "I didn't find such a user")
  }
}
