const mongoose = require('mongoose')

const reservationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    hotelId: {
      type: mongoose.Types.ObjectId,
      ref: 'Hotel',
      required: true,
    },
    roomId: {
      type: mongoose.Types.ObjectId,
      ref: 'Room',
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    people: {
      type: Object,
      adults: {
        type: Number,
        required: true,
        min: 1,
      },
      children: {
        type: Number,
        required: true,
        min: 0,
      },
      required: true,
    },
    isPaid: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
)

const Reservation = mongoose.model('Reservation', reservationSchema)

module.exports = Reservation
