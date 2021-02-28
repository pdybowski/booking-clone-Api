const mongoose = require('mongoose')
const express = require('express')
const { Reservation } = require('../models/reservation')
const { Room } = require('../models/room')
const { Hotel } = require('../models/hotel')
const ApiError = require('../helpers/apiError')
const router = express.Router()

router.get('/free/:hotelId', async (req, res) => {
  if (!req.query.startDate || !req.query.endDate)
    return new ApiError(400, 'Provide start date and end date.')

  const { hotelId } = req.params
  const { startDate, endDate } = req.query

  const freeRooms = []

  const reservations = await Reservation.find({ hotelId: hotelId })
  
  reservations.forEach((reservation) => {
    if (reservation.startDate > endDate || reservation.endDate < startDate) {
      const room = await Room.find({ _id: reservation.roomId })
      freeRooms.push(room)
    }
  })

  res.send(freeRooms)
})
