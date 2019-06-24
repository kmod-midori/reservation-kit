const { disallow } = require('feathers-hooks-common')
const Reservation = require('../models/reservations.model')

const cacheMap = new Map()

module.exports = function(app) {
  app.use('/seatStatus', {
    events: ['status'],
    async get(roomId, params) {
      let seats = {}
      const cacheKey = roomId.toString()
      if (cacheMap.has(cacheKey)) {
        seats = cacheMap.get(cacheKey)
      } else {
        const active = await Reservation.find({
          roomId,
          expired: false
        })

        for (const resv of active) {
          seats[resv.seatId] = resv.confirmed ? 'using' : 'reserved'
        }
        cacheMap.set(cacheKey, seats)
      }

      return {
        _id: roomId,
        status: seats
      }
    },
    update(roomId, data) {
      return Promise.resolve(data)
    }
  })

  const svc = app.service('seatStatus')

  svc.hooks({
    before: {
      update: [disallow('external')]
    }
  })

  const updateAndNotify = async function(roomId, context) {
    cacheMap.delete(roomId.toString())
    context.params.provider = undefined
    await svc.update(
      roomId,
      await svc.get(roomId, context.params),
      context.params
    )
  }
  const handleUpdate = async function(resvObj, context) {
    if (Array.isArray(resvObj)) {
      const roomIds = new Set()
      for (const resv of resvObj) {
        roomIds.add(resv.roomId)
      }
      for (const roomId of roomIds) {
        await updateAndNotify(roomId, context)
      }
    } else {
      await updateAndNotify(resvObj.roomId, context)
    }
  }

  const resvSvc = app.service('reservations')
  resvSvc.on('created', handleUpdate)
  resvSvc.on('updated', handleUpdate)
  resvSvc.on('patched', handleUpdate)
  resvSvc.on('removed', handleUpdate)
}
