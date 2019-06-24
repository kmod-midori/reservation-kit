const createService = require('feathers-mongoose')
const {
  required,
  iff,
  paramsFromClient,
  fastJoin
} = require('feathers-hooks-common')
const { Forbidden, BadRequest } = require('@feathersjs/errors')
const BatchLoader = require('@feathers-plus/batch-loader')
const { loaderFactory } = BatchLoader
const jws = require('jws')

const Model = require('../models/reservations.model')

const { acquire, release } = require('../hooks/mutex')
const { verify: reCaptchaVerify } = require('../hooks/recaptcha')

module.exports = function(app) {
  app.use(
    '/reservations',
    createService({
      Model,
      lean: true,
      paginate: {
        default: 10,
        max: 25
      }
    })
  )

  const service = app.service('reservations')
  const roomService = app.service('rooms')

  const roomMode = iff(
    hook => hook.params.room.mode === 'room',
    required('startTime', 'endTime', 'usage'),
    async function({ data, params, service }) {
      const conflicting = await service.find({
        query: {
          roomId: data.roomId,
          startTime: { $lte: data.startTime },
          endTime: { $gte: data.endTime }
        },
        params
      })
      if (conflicting.total > 0) {
        throw new Forbidden('Specified time range is already occupied.')
      }

      data.adminStatus = 'waiting'
    }
  )

  const seatMode = iff(
    hook => hook.params.room.mode === 'seat',
    required('seatId'),
    async function({ data, params, service }) {
      const conflicting = await service.find({
        query: {
          roomId: data.roomId,
          expired: false,
          seatId: data.seatId
        },
        params
      })
      if (conflicting.total > 0) {
        throw new Forbidden('This seat is already occupied.')
      }

      const selfConflicting = await service.find({
        query: {
          userId: params.user._id,
          seatId: { $ne: null },
          expired: false
        }
      })
      if (selfConflicting.total > 0) {
        throw new Forbidden(
          'You have already reserved a seat in this or other rooms.'
        )
      }

      data.expired = false
      data.confirmed = false
    }
  )

  const commonChecks = async function(hook) {
    if (Array.isArray(hook.data)) {
      throw new Forbidden('Batch creation of reservations is not allowed')
    }
    hook.data.userId = hook.params.user._id
    hook.params.room = await roomService.get(hook.data.roomId, hook.params)
  }

  const resolvers = {
    before(context) {
      context._loaders = { rooms: {} }
      context._loaders.rooms._id = loaderFactory(roomService, '_id', false, {
        paginate: false
      })(context)
    },
    joins: {
      room: () => async (resv, context) => {
        resv.room = await context._loaders.rooms._id.load(resv.roomId)
      }
    }
  }

  service.hooks({
    before: {
      create: [
        paramsFromClient('recaptchaResponse'),
        reCaptchaVerify(),
        required('roomId'),
        commonChecks,
        acquire('rooms'),
        roomMode,
        seatMode
      ],
      patch: [
        paramsFromClient('qrData'),
        function(hook) {
          if (hook.params.qrData) {
            if (
              !jws.verify(hook.params.qrData, 'HS256', app.get('qrCode').secret)
            ) {
              throw new BadRequest(
                'Invalid QR code. Please refresh and try again.'
              )
            }
          }
        },
        acquire('rooms')
      ]
    },
    after: {
      all: [fastJoin(resolvers)],
      create: [release('rooms')],
      patch: [release('rooms')]
    },
    error: {
      create: [release('rooms')],
      patch: [release('rooms')]
    }
  })
}
