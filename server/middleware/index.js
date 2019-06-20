const { render } = require('./nuxt')

module.exports = function(app) {
  // Add your custom middleware here. Remember that
  // in Express, the order matters.
  app.use((req, res, next) => {
    const accepts = req.accepts('html', 'json')
    if (accepts === 'json') return next()
    render(req, res, next)
  })
}
