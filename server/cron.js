const { CronJob } = require('cron')
const moment = require('moment')
module.exports = function(app) {
  const expireJob = new CronJob('*/10 * * * * *', async function() {
    const resvService = app.service('reservations')
    const activeReservations = await resvService.find({
      provider: null,
      query: {
        seatId: { $ne: null },
        expired: false,
        confirmed: false
      },
      paginate: false
    })
    for (const resv of activeReservations) {
      const diff = moment().diff(moment(resv.createdAt), 'minutes')
      if (diff > resv.room.minDuration) {
        await resvService.patch(
          resv._id,
          {
            expired: true
          },
          {
            provider: null
          }
        )
      }
    }
  })
  expireJob.start()
}
