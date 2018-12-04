const S = require('sequelize')

const sequelize = new S('database', 'user', 'password', {
    host: 'localhost',
    dialect: 'sqlite',
    logging: false,
    operatorsAliases: false,
    // SQLite only
    storage: 'database.sqlite',
})

const cache = new Map()

const Users = sequelize.define('users', {
  id: {
    type: S.STRING,
    unique: true,
    primaryKey: true
  },
  powerlevel: {
    type: S.INTEGER,
    defaultValue: 0
  },
  blacklistReason: S.TEXT,
  cardColor: {
    type: S.STRING,
    defaultValue: '#9B9B9B'
  },
  points: {
    type: S.INTEGER,
    defaultValue: 0
  }
})

Users.sync()

async function getUser(user) {
  const data = cache.get(user) || await Users.findOne({where: {id: user}})
  if(data) await cacheUser(data)
  return data
}

async function cacheUser(user) {
  const stuff = {
    id: user.id,
    powerlevel: user.powerlevel,
    blacklistReason: user.blacklistReason,
    cardColor: user.cardColor,
    points: user.points
  }
  cache.set(user.id, stuff)
}

async function addUser(id) {
  const user = await Users.create({id: id})
  await cacheUser(user)
  return user
}

async function forceUser(id) {
  const user = await getUser(id)
  if(user) return user
  return await addUser(id)
}

async function getUserFresh(user) {
  return await Users.findOne({where: {id: user}})
}

async function updateUser(data, user) {
  await Users.update(data, {where: {id: user}})

  const update = await getUserFresh(user)

  await cacheUser(update)

  return update
}

module.exports = {getUser, cacheUser, addUser, forceUser, getUserFresh, updateUser}
