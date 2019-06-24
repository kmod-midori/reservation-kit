const mongoose = require('mongoose')

const Schema = mongoose.Schema

const schema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      required: true
    },
    roomId: {
      type: Schema.Types.ObjectId,
      required: true
    },

    expired: Boolean,
    confirmed: Boolean,

    adminStatus: {
      type: String,
      enum: ['waiting', 'accepted', 'rejected']
    },

    startTime: Date,
    endTime: Date,
    seatId: Number,
    usage: String
  },
  {
    timestamps: true
  }
)

module.exports = mongoose.model('Reservation', schema)
