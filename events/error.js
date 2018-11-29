const {errorHook} = require('../includes/logging')
const {RichEmbed} = require('discord.js')

module.exports = async (client, error) => {
  console.error(error)
  errorHook.send(new RichEmbed().setColor(0x0000FF).setTitle(`Client error`).setDescription(error.stack))
}
