const { when } = require('feathers-hooks-common')
const { authenticate } = require('@feathersjs/authentication').hooks
const { protect } = require('@feathersjs/authentication-local').hooks
const authorize = require('./hooks/abilities')

module.exports = {
  before: {
    all: [
      when(
        hook =>
          hook.params.provider &&
          `/${hook.path}` !== hook.app.get('authentication').path,
        authenticate('jwt'),
        authorize()
      )
    ]
  },
  after: {
    all: [protect('password')]
  }
}
