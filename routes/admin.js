const mongoose = require('mongoose')
const express = require('express')
const { User, fullName } = require('../models/user')
const router = express.Router()

router.get('/', async (req, res) => {
  const users = await User.find()

  res.send(users)
})

router.get('/owners', async (req, res) => {
    const owners = await User.find(
        { "role": /hotelOwner/i }
    )

    res.send(owners)
})

router.put('/owner/accept/:email', async (req, res) => {
    const email = req.params.email

    try {
        await User.updateOne({email: email}, {role: 'hotelOwner'})

        res.status(200).send('Done')
    } catch (err) {
        console.log(err)
        res.status(500).send('Something went wrong')
    }
})

router.delete('/owner/:email', async (req, res) => {
    const email = req.params.email
    
    try {
        const id = await User.find({ email: email, "role": /hotelOwner/i }, '_id')
        if(id.length === 0){
            res.status(400).send('Wrong email or user is not a hotel owner')
        }
        await User.findByIdAndDelete(id)

        res.status(200).send(id)
    } catch (err) {
        console.log(err)
        res.status(500).send('Something went wrong')
    }
})

router.delete('/:email', async (req, res) => {
    const email = req.params.email
    
    try {
        const id = await User.find({ email: email, "role": /user/i }, '_id')
        if(id.length === 0){
            res.status(400).send('Wrong email')
        }
        await User.findByIdAndDelete(id)

        res.status(200).send(id)
    } catch (err) {
        console.log(err)
        res.status(500).send('Something went wrong')
    }
})

module.exports = router