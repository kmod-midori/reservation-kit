import { feathersVuex } from '../feathers-client'

export const plugins = [
  feathersVuex.auth({ userService: 'users' }),
  feathersVuex.service('users', {
    instanceDefaults() {
      return {
        uid: '',
        email: '',
        admin: false
      }
    }
  }),
  feathersVuex.service('rooms', {
    instanceDefaults() {
      return {
        name: '',
        openTime: '08:00',
        closeTime: '22:00',
        minDuration: 30,
        mode: 'room',
        minDays: 3,
        maxDays: 30,
        message: '',
        seats: []
      }
    }
  }),
  feathersVuex.service('seatStatus'),
  feathersVuex.service('reservations', {
    instanceDefaults() {
      return {
        roomId: null,
        room: 'Room',
        seatId: null,
        startTime: null,
        endTime: null,
        usage: null
      }
    }
  }),
  feathersVuex.service('qrcodes')
]

export const strict = false
