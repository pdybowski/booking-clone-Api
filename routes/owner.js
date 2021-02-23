const mongoose = require('mongoose')
const express = require('express')
const { Hotel, validate } = require('../models/hotel')
const { Reservation } = require('../models/reservation')
const router = express.Router()

// TODO: add auth middlewear, when it will be ready

router.get('/hotels', async (req, res) => {
  const hotel = await Hotel.find()

  res.status(200).send(hotel)
})

router.post('/hotel', async (req, res) => {
  const { error } = validate(req.body)
  if (error) return res.status(400).send(error.details[0].message)

  const hotel = new Hotel(req.body)

  await hotel.save()

  res.status(200).send(hotel)
})

router.put('/hotel/:id', async (req, res) => {
  const { error } = validate(req.body)
  if (error) return res.status(400).send(error.details[0].message)
  try {
    const hotel = await Hotel.findByIdAndUpdate(req.params.id, req.body)

    res.status(200).send(hotel)
  } catch (err) {
    console.log(err)
    res.status(500).send('Something went wrong')
  }
})

router.delete('/hotel/:id', async (req, res) => {
  const id = req.params.id
  try {
    const reservation = await Reservation.find({ hotelId: id })

    if (reservation.length > 0)
      return res.status(400).send('Remove reservations')

    await Hotel.findByIdAndDelete(id)
    res.status(200).send('Hotel deleted')
  } catch (err) {
    console.log(err)
    res.status(500).send('Something went wrong')
  }
})

router.delete('/reservation/:id', async (req, res) => {
  const id = req.params.id
  try {
    const reservation = await Reservation.findByIdAndDelete(id)
    if (!reservation) {
      return res.status(404).send('Reservation with given ID was not found')
    }

    const startDate = new Date(reservation.startDate)
    const currentDate = new Date('<YYYY-mm-ddTHH:MM:ssZ>')

    const msPerDay = 1000 * 60 * 60 * 24
    const msBetween = startDate.getTime() - currentDate.getTime()
    const days = Math.floor(msBetween / msPerDay)

    if (reservation.isPaid || days <= 3) {
      return res
        .status(400)
        .send(
          'Can not delete reservation; reservation is paid or or there is less than 3 days to start the stay in the hotel'
        )
    }

    res.status(200).send('Reservation deleted')
  } catch (err) {
    console.log(err)
    res.status(500).send('Something went wrong')
  }
})

module.exports = router
