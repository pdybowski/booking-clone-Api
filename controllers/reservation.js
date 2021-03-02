const {
  getReservations,
  saveReservation,
  cancelReservation,
} = require('../services/reservation')
const getUserFromRequest = require('../helpers/getUserFromRequest')

exports.getReservations = async (req, res, next) => {
  try {
    const user = getUserFromRequest(req)
    const reservations = await getReservations(user)
    return res.json(reservations)
  } catch (error) {
    next(error)
  }
}

exports.saveReservation = async (req, res, next) => {
  try {
    const user = getUserFromRequest(req)
    const success = await saveReservation(user, req.body)
    return res.json({ success })
  } catch (error) {
    next(error)
  }
}

exports.cancelReservation = async (req, res, next) => {
  try {
    const user = getUserFromRequest(req)
    const success = await cancelReservation(user, req.params.id)
    return res.json({ success })
  } catch (error) {
    next(error)
  }
}
