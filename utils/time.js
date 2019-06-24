const moment = require('moment')
const TIME_FORMAT = 'HH:mm'

exports.roomAvailable = function(room) {
  const now = moment()
  const minDuration = room.minDuration
  return now.isBetween(
    moment(room.openTime, TIME_FORMAT).subtract(minDuration, 'minutes'),
    moment(room.closeTime, TIME_FORMAT).subtract(minDuration * 2, 'minutes'),
    null,
    '[]'
  )
}
