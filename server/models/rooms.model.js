const mongoose = require('mongoose')

const Schema = mongoose.Schema

const schema = new Schema({
  name: {
    type: String,
    required: true
  },
  openTime: {
    type: String,
    required: true
  },
  closeTime: {
    type: String,
    required: true
  },
  seats: [
    {
      id: {
        type: Number,
        required: true
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
