module.exports = async function(app) {
  const userSvc = app.service('users')
  const users = await userSvc.find({
    query: { $limit: 0 },
    provider: null
  })
  if (users.total > 0) return

  await userSvc.create({
    uid: '0001',
    name: 'Admin',
    password: 'admin',
    email: 'me@example.com',
    admin: true
  })

  console.log(
    'Initial admin user `0001` with password `pass` has been created.'
  )
}
