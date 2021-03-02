const mongoose = require('mongoose')

const roomSchema = new mongoose.Schema({
  hotelId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Hotel',
    required: true,
  },
  beds: {
    type: Object,
    single: {
      type: Number,
      require: true,
    },
    double: {
      type: Number,
      required: true,
    },
  },
  price: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
})

exports.roomSchema = roomSchema
