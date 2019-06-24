module.exports = function(app) {
  app.configure(require('./users/users.service'))
  app.configure(require('./rooms.service'))
  app.configure(require('./reservations.service'))
  app.configure(require('./seatStatus.service'))
  app.configure(require('./qrcodes.service'))
  app.configure(require('./mailer.service'))
}
