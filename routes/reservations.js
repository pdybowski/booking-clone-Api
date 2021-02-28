const mongoose = require('mongoose')
const express = require('express')
const { Reservation, validate } = require('../models/reservation')
const { Room } = require('../models/room')
const ApiError = require('../helpers/apiError')
const router = express.Router()

// TODO: add auth middlewear, when it will be ready

router.get('/', async (req, res) => {
  const reservations = await Reservation.find()

  res.send(reservations)
})

router.post('/', async (req, res) => {
  const { error } = validate(req.body)
  if (error) throw new ApiError(400, error.details[0].message)

  const room = await Room.findById(req.body.roomId)
  if (!room) throw new ApiError(400, 'Wrong room ID.')

  const { occupiedDates } = room
  const { startDate, endDate } = req.body

  let reservation = new Reservation(req.body)

  await reservation.save()

  occupiedDates.push({
    startDate: new Date(startDate),
    endDate: new Date(endDate),
  })

  await room.save()

  res.send(reservation)
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
