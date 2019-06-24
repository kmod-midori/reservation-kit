const { hashPassword } = require('@feathersjs/authentication-local').hooks

module.exports = {
  before: {
    all: [],
    find: [],
    get: [],
    create: [hashPassword()],
    update: [hashPassword()],
    patch: [hashPassword()],
    remove: []
  },

  after: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  }
}
