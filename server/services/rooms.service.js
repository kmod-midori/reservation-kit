const createService = require('feathers-mongoose')

const CacheMap = require('@feathers-plus/cache')
const mongoose = require('mongoose')
const { cache } = require('feathers-hooks-common')
const makeCacheKey = key =>
  key instanceof mongoose.Types.ObjectId ? key.toString() : key
const cacheMap = CacheMap({ max: 20 })

const Model = require('../models/rooms.model')

module.exports = function(app) {
  app.use(
    '/rooms',
    createService({
      Model,
      lean: true,
      paginate: false
    })
  )

  const service = app.service('rooms')
  service.hooks({
    before: {
      all: cache(cacheMap, undefined, { makeCacheKey })
    },
    after: {
      all: cache(cacheMap, undefined, { makeCacheKey })
    }
  })
}
