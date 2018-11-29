const {greentick, yellowtick} = require('../includes/emotes')

exports.run = async (client, message) => {

  const msg = await message.channel.send(`${yellowtick} Pong!`);
  msg.edit(`${greentick} Pong! Latency: \`${msg.createdTimestamp - message.createdTimestamp}ms\`. API Latency: \`${Math.round(client.ping)}ms\``);


}

exports.help = {
  name: 'ping',
  info: 'Checks if bot responds',
  usage: '',
  unlisted: false,
}

exports.config = {
  guildOnly: false,
  ownerOnly: false,
  aliases: ['pong'],
  minLevel: 0
}
