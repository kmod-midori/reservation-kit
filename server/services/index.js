module.exports = function(app) {
  app.configure(require('./users/users.service'))
}
