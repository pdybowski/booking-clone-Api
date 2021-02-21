const Joi = require('joi')
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
    roomlId: {
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

const validateReservation = (reservation) => {
  const schema = Joi.object({
    userId: Joi.ObjectId().required(),
    hotelId: Joi.ObjectId().required(),
    roomId: Joi.ObjectId().required(),
    startDate: Joi.date().required(),
    endDate: Joi.date().required(),
    people: Joi.object({
      children: Joi.number.min(0).required(),
      adults: Joi.number.min(1).required(),
    }),
  })

  return schema.validate(reservation)
}

exports.validate = validateReservation
exports.Reservation = Reservation
