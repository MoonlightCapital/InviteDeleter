require('dotenv').config()

const http = require('http')
const express = require('express')
const app = express()
app.get("/", (request, response) => {
  response.sendStatus(200)
})
app.listen(process.env.PORT);
setInterval(() => {
  http.get(`http://${process.env.PROJECT_DOMAIN}.glitch.me/`)
}, 280000)

const Discord = require('discord.js')
const fs = require('fs')
const config = require('./config.js')

const client = new Discord.Client({
  disabledEvents: ['TYPING_START'],
  restWsBridgeTimeout: 10000,
  restTimeOffset: 1000
})

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

client.login(process.env.BOT_TOKEN)

process.on('unhandledRejection', (error, p) => {
  console.error(error)
  client.specialChannels.ERROR_LOG.send(new Discord.RichEmbed().setColor(0xFFFF00).setTitle(`Unhandled promise rejection as ${p}`).setDescription(error.toString()))
})

process.on('uncaughtException', error => {
  console.error(error.stack)
  client.specialChannels.ERROR_LOG.send(new Discord.RichEmbed().setColor(0xFF0000).setTitle(`Uncaught exception`).setDescription(error.stack))
  process.exit(1)
})
