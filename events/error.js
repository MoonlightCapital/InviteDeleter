
const {RichEmbed} = require('discord.js')

module.exports = async (client, error) => {
  console.error(error)
  client.specialChannels.ERROR_LOG.send(new RichEmbed().setColor(0x0000FF).setTitle(`Client error`).setDescription(error))
}
