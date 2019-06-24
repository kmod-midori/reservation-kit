const mailer = require('feathers-mailer')

module.exports = function(app) {
  const config = app.get('mailer')
  if (!config) {
    app.use('mailer', {
      create: function() {
        return Promise.resolve({})
      }
    })
    return
  }

  app.use('mailer', mailer(config, { from: config.auth.user }))
}
