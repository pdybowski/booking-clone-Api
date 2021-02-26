const mongoose = require('mongoose')
const express = require('express')
const User = require('../models/user')
const ApiError = require('../helpers/apiError')
const router = express.Router()
const { isAdmin } = require('../middleware/role')
const { HOTEL_OWNER_ROLE, USER_ROLE } = require('../models/roles')

router.get('/', async (req, res) => {
  const users = await User.find()

  res.json(users)
})

router.get('/owners', async (req, res) => {
  const owners = await User.find({ role: HOTEL_OWNER_ROLE })

  res.json(owners)
})

router.put('/owner/accept/:email', async (req, res) => {
  const email = req.params.email

  try {
    const owner = await User.updateOne(
      { email: email },
      { role: HOTEL_OWNER_ROLE }
    )

    res.status(200).json('Done')
  } catch (err) {
    throw new ApiError(500, 'Something went wrong')
  }
})

router.delete('/owner/:email', async (req, res) => {
  const email = req.params.email

  try {
    const id = await User.findOneAndDelete({
      email: email,
      role: HOTEL_OWNER_ROLE,
    })
    if (!id) {
      throw new ApiError(400, 'Wrong email or user is not a hotel owner')
    }

    res.status(200).json(id)
  } catch (err) {
    throw new ApiError(500, 'Something went wrong')
  }
})

router.delete('/:email', async (req, res) => {
  const email = req.params.email

  try {
    const id = await User.findOneAndDelete({
      email: email,
      role: USER_ROLE,
    })
    if (!id) {
      throw new ApiError(400, 'Wrong email')
    }

    res.status(200).json(id)
  } catch (err) {
    throw new ApiError(500, 'Something went wrong')
  }
})

module.exports = router
