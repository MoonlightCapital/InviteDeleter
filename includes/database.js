const loki = require('lokijs')
const cache = new Map()

const db = new loki('database.db', {
  autoload: true,
  autosave: true,
  autoloadCallback: loadCollections,
  autosaveInterval: 1000
})

const collections = ['guilds', 'users', 'reports']
function loadCollections () {
  collections.forEach(x => {
    let coll = db.addCollection(x)

    db[x] = coll
  })
}


//module.exports = db

/*const S = require('sequelize')

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

Users.sync()*/

async function getUser(user) {
  const data = cache.get(user) || db.users.findOne({id: user})
  if(data) await cacheUser(data)
  return data
}

async function cacheUser(user) {
  cache.set(user.id, user)
}

async function addUser(id) {
  const user = await db.users.insert({
    id: id,
    powerlevel: 0,
    blacklistReason: '',
    cardColor: '#9B9B9B',
    points: 0
  })

  await cacheUser(user)
  return user
}

async function forceUser(id) {
  const user = await getUser(id)
  if(user) return user
  return await addUser(id)
}

async function getUserFresh(user) {
  return db.users.findOne({id: user})
}

async function updateUser(data) {
  await db.users.update(data)

  const update = await getUserFresh(data.id)

  await cacheUser(update)

  return update
}

module.exports = {getUser, cacheUser, addUser, forceUser, getUserFresh, updateUser, _raw: db}
