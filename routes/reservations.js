const express = require('express')
const Reservation = require('../models/reservation')
const ApiError = require('../helpers/apiError')
const router = express.Router()
const validateCreateReservationData = require('../middleware/validateCreateReservation')
const reservationController = require('../controllers/reservation')

router.get('/', async (req, res, next) => {
  reservationController.getReservations(req, res, next)
})

router.post('/', validateCreateReservationData, async (req, res, next) => {
  reservationController.saveReservation(req, res, next)
})

router.put('/payment/:id', async (req, res) => {
  try {
    const reservation = await Reservation.findByIdAndUpdate(
      req.params.id,
      {
        isPaid: true,
      },
      { new: true }
    )

    res.send(reservation)
  } catch {
    throw new ApiError(404, 'Reservation with the gived ID was not found.')
  }
})

module.exports = router
