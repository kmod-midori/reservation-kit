import { feathersVuex } from '../feathers-client'

export const plugins = [
  feathersVuex.auth({ userService: 'users' }),
  feathersVuex.service('users')
]
