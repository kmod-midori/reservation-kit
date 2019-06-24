const got = require('got')
const { Forbidden } = require('@feathersjs/errors')

exports.verify = function() {
  return async function(hook) {
    const response = hook.params.recaptchaResponse
    if (!response) throw new Forbidden('reCaptcha response required')
    const secret = hook.app.get('recaptcha').secret
    const { body } = await got.post(
      'https://www.recaptcha.net/recaptcha/api/siteverify',
      {
        query: {
          secret,
          response
        }
      }
    )
    if (!JSON.parse(body).success) throw new Forbidden('reCaptcha verification failed')
  }
}
