const mongoose = require('mongoose')

const Schema = mongoose.Schema

const schema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  openTime: {
    type: String,
    required: true
  },
  closeTime: {
    type: String,
    required: true
  },
  minDuration: {
    type: Number,
    required: true
  },
  mode: {
    type: String,
    required: true,
    enum: ['room', 'seat']
  },
  minDays: Number,
  maxDays: Number,
  message: String,
  seats: [
    {
      id: {
        type: Number,
        required: true,
        unique: true
      },
      x: {
        type: Number,
        required: true
      },
      y: {
        type: Number,
        required: true
      },
      width: {
        type: Number,
        required: true
      },
      height: {
        type: Number,
        required: true
      }
    }
  ]
})

module.exports = mongoose.model('Room', schema)
