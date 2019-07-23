const {escapeMarkdown} = require('./utilities')

function formatCommand (message, command) {
  return `:trackball: ${escapeMarkdown(message.author.tag)} (\`${message.author.id}\`) used command **${command}** in channel ${message.channel.id}`
}

module.exports = {formatCommand}
