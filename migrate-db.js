console.log('Starting database migration...')

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

const loki = require('lokijs')

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

Users.findAll().then(users => {
  db.users.insert(users)
  db.users.checkAllIndexes({ repair: true, randomSampling: true, randomSamplingFactor: 0.15 })
  console.log('Migration successfully completed')
  process.exit(0)
})
