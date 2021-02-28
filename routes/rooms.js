const mongoose = require('mongoose')
const express = require('express')
const { Room } = require('../models/room')
const { Hotel } = require('../models/hotel')
const ApiError = require('../helpers/apiError')
const router = express.Router()

router.get('/free/:hotelID', async (req, res) => {
  const hotel = await Hotel.findById(req.params.hotelID)
  if (!hotel) return new ApiError(400, 'Wrong Hotel ID.')

  const startDate = new Date(req.query.startDate)
  const endDate = new Date(req.query.endDate)

  const { rooms } = hotel
  const freeRooms = []

  rooms.forEach((room) => {
    room.occupiedDates.forEach((dates) => {
      if (dates.endDate < startDate || dates.startDate > endDate) {
        freeRooms.push({
          startDate: startDate,
          endDate: endDate,
        })
      }
    })
  })

  res.send(freeRooms)
})
