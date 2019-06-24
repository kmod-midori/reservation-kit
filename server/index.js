const consola = require('consola')

const app = require('./app')
const host = app.get('host')
const port = process.env.PORT || app.get('port')
const server = app.listen(port)

process.on('unhandledRejection', (reason, p) =>
  consola.error('Unhandled Rejection at: Promise ', p, reason)
)

server.on('listening', () =>
  consola.ready({
    message: `Feathers application started on ${host}:${port}`,
    badge: true
  })
)
