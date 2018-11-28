const S = require('sequelize')

const sequelize = new S('database', 'user', 'password', {
    host: 'localhost',
    dialect: 'sqlite',
    logging: false,
    operatorsAliases: false,
    // SQLite only
    storage: 'database.sqlite',
})

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
  return await Users.findOne({where: {id: user}})
}

async function addUser(id) {
  return await Users.create({id: id})
}

async function forceUser(id) {
  const user = await getUser(id)
  if(user) return user
  return await addUser(id)
}

async function updateUser(data, user) {
  return await Users.update(data, {where: {id: user}})
}

module.exports = {getUser, addUser, forceUser, updateUser}
