const express = require('express')
const adminController = require('../controllers/adminController')
const router = express.Router()

router.get('/', async (req, res, next) => {
  adminController.getUsers(req, res, next)
})

router.get('/owners', async (req, res, next) => {
  adminController.getHotelOwners(req, res, next)
})

router.put('/owner/accept/:email', async (req, res, next) => {
  adminController.acceptOwnersEmail(req, res, next)
})

router.delete('/owner/:email', async (req, res, next) => {
  adminController.deleteOwner(req, res, next)
})

router.delete('/:email', async (req, res) => {
  adminController.deleteUser(req, res, next)
})

router.delete('/hotel/:id', async (req, res) => {
  const hotelId = req.params.id
  const { forceDelete } = req.query
  const isForceDelete = forceDelete === 'true'
  const reservation = await Reservation.find({ hotelId: id })
  try {
    if (reservation.length > 0 && isForceDelete) {
      await Reservation.deleteMany(hotelId)
      await Hotel.findByIdAndDelete(hotelId)
      //sms
    }

    if (reservation.length > 0 && !isForceDelete) {
      throw new ApiError(400, 'Remove reservation first')
    }

    await Hotel.findByIdAndDelete(hotelId)
    res.status(200).send('Hotel removed')
  } catch (err) {
    throw new ApiError(500, 'Something went wrong')
  }
})

module.exports = router
