const mongoose = require('mongoose')
const express = require('express')
const roomController = require('../controllers/roomController')
const ApiError = require('../helspers/apiError')
const router = express.Router()

router.get('/free/:hotelId', async (req, res, next) => {
  roomController.getFreeRooms(req, res, next)
})
