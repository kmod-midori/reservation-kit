const mongoose = require('mongoose')

const Schema = mongoose.Schema

const schema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      required: true
    },
    room: {
      type: Schema.Types.ObjectId,
      required: true
    },
    expired: {
      type: Boolean,
      default: false
    },
    confirmed: {
      type: Boolean,
      default: false
    },
    startTime: Date,
    endTime: Date,
    seatId: Number
  },
  {
    timestamps: true
  }
)

module.exports = mongoose.model('Reservation', schema)
