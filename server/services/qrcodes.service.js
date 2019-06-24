const jws = require('jws')
const QRCode = require('qrcode')

module.exports = function(app) {
  app.use('/qrcodes', {
    find: async function(params) {
      const payload = {
        u: params.user._id,
        exp: Math.floor(new Date() / 1000)
      }
      const signature = jws.sign({
        header: { alg: 'HS256' },
        payload: payload,
        secret: app.get('qrCode').secret
      })

      return Promise.resolve([
        {
          _id: 1,
          src: await QRCode.toDataURL(signature, { width: 500 })
        }
      ])
    }
  })
}
