const path = require('path')

const feathers = require('@feathersjs/feathers')
const express = require('@feathersjs/express')

process.env.NODE_CONFIG_DIR = path.join(__dirname, 'config/')
const configuration = require('@feathersjs/configuration')

const socketio = require('@feathersjs/socketio')
const cors = require('cors')
const helmet = require('helmet')
const compression = require('compression')

const mongoose = require('mongoose')

const app = express(feathers())

app.configure(configuration())
app.configure(socketio())
app.configure(express.rest())

app.use(helmet())
app.use(cors())
app.use(compression())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

mongoose.Promise = global.Promise
mongoose.connect(app.get('mongodb'), { useNewUrlParser: true })

app.configure(require('./middleware'))
app.configure(require('./authentication'))
app.configure(require('./services'))

module.exports = app
