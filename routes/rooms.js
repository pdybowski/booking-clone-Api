const mongoose = require('mongoose')
const express = require('express')
const { Reservation } = require('../models/reservation')
const { Room } = require('../models/room')
const { Hotel } = require('../models/hotel')
const ApiError = require('../helspers/apiError')
const router = express.Router()

router.get('/free/:hotelId', async (req, res) => {
  if (!req.query.startDate || !req.query.endDate)
    return new ApiError(400, 'Provide start date and end date.')

  const { hotelId } = req.params
  const { startDate, endDate } = req.query

  const freeRooms = []

  const rooms = await Room.find({ hotelId: hotelId })

  rooms.forEach(async (room) => {
    const reservation = await Reservation.find({ roomId: room._id })
    if (
      (startDate && endDate) < reservation.startDate ||
      (startDate && endDate) > reservation.endDate
    ) {
      freeRooms.push(room)
    }
  })

  res.send(freeRooms)
})
