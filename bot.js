const Discord = require('discord.js')
const fs = require('fs')
const config = require('./config.js')

const client = new Discord.Client()

client.config = config
client.dversion = Discord.version
client.utils = require('./includes/utilities')
client.db = require('./includes/database')
client.pl = require('./includes/powerlevels')


// Taken from an idiot's guide

// Loading events
const eventFiles = fs.readdirSync('./events/').filter(file => file.endsWith('.js'))
eventFiles.forEach(file => {

  const filename = `./events/${file}`
  const eventName = file.split('.')[0]
  const event = require(filename)
  client.on(eventName, event.bind(null, client))
})

// Loading commands
client.commands = new Discord.Collection()
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'))

commandFiles.forEach(file => {

  const filename = `./commands/${file}`
  const command = require(filename)
  const commandName = file.split('.')[0]
  client.commands.set(commandName, command)
})

client.login(config.token)
