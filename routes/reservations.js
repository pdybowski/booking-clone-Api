const mongoose = require('mongoose')
const express = require('express')
const { Reservation, validate } = require('../models/reservation')
const router = express.Router()

// TODO: add auth middlewear, when it will be ready

router.get('/', async (req, res) => {
  const reservations = await Reservation.find()

  res.send(reservations)
})

router.post('/', async (req, res) => {
  const { error } = validate(req.body)
  if (error) return res.status(400).send(error.details[0].message)

  let reservation = new Reservation({
    userId: req.body.userId,
    hotelId: req.body.hotelId,
    roomId: req.body.roomId,
    startDate: req.body.startDate,
    endDate: req.body.endDate,
    people: {
      adults: req.body.people.adults,
      children: req.body.people.children,
    },
  })

  await reservation.save()

  res.send(reservation)
})

router.put('/payment/:id', async (req, res) => {
  const reservation = await Reservation.findByIdAndUpdate(
    req.params.id,
    {
      isPaid: true,
    },
    { new: true }
  )

  if (!reservation)
    return res.status(404).send('Reservation with the gived ID was not found.')

  res.send(reservation)
})

router.delete('/:id', async (req, res) => {
  const reservation = await Reservation.findByIdAndRemove(req.params.id)

  if (!reservation)
    return res
      .status(404)
      .send('The reservation with the given ID was not found.')

  res.send(reservation)
})

module.exports = router
