import feathers from '@feathersjs/feathers'
import socketio from '@feathersjs/socketio-client'
import auth from '@feathersjs/authentication-client'
import _feathersVuex from 'feathers-vuex'
import io from 'socket.io-client'

const addr =
  location.protocol +
  '//' +
  location.hostname +
  (location.port ? ':' + location.port : '')

const socket = io(addr, { transports: ['websocket'] })

export const feathersClient = feathers()
  .configure(socketio(socket))
  .configure(auth({ storage: window.localStorage }))

export const feathersVuex = _feathersVuex(feathersClient, { idField: '_id' })
