const mongoose = require('mongoose')
const express = require('express')
const { Hotel } = require('../models/hotel')
const router = express.Router()

router.get('/', async (req, res) => {
  const hotel = await new Hotel.find()

  res.status(200).send(hotel)
})

router.get('/:limit', async (req, res) => {
  const limit = req.params.limit
  const hotel = await new Hotel.find().limit(limit)

  res.status(200).send(hotel)
})

router.get('/hotel/:hotelId', async (req, res) => {
  const id = req.params.hotelId
  const hotel = await Hotel.findById(id)

  if (!hotel) {
    return res.status(404).send('Hotel with provided ID not found')
  }

  res.status(200).send(hotel)
})

router.get('/city/:city', async (req, res) => {
  const city = req.params.city
  const hotel = await Hotel.find().where('localization.city', city)

  if (!hotel) {
    return res.status(404).send(`There's no hotels in city '${city}'`)
  }

  res.status(200).send(hotel)
})

module.exports = router
