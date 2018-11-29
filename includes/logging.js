const {WebhookClient} = require('discord.js')
const config = require('../config')
const {escapeMarkdown} = require('./utilities')

const logHook = new WebhookClient(config.webhooks.log[0], config.webhooks.log[1])
const commandHook = new WebhookClient(config.webhooks.command[0], config.webhooks.command[1])
const errorHook = new WebhookClient(config.webhooks.error[0], config.webhooks.error[1])

function formatCommand (message, command) {
  return `:trackball: ${escapeMarkdown(message.author.tag)} (\`${message.author.id}\`) used command **${command}** in channel ${message.channel.id}`
}

module.exports = {logHook, commandHook, errorHook, formatCommand}
