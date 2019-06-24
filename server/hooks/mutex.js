const { Mutex } = require('await-semaphore')

const mutexes = {}
const releaseCallbacks = {}

exports.acquire = function(name) {
  return async function(hook) {
    if (typeof mutexes[name] === 'undefined') {
      mutexes[name] = new Mutex()
    }
    const callback = await mutexes[name].acquire()
    releaseCallbacks[name] = callback
  }
}

exports.release = function(name) {
  return function(hook) {
    const callback = releaseCallbacks[name]
    if (callback) {
      callback()
    }
  }
}
