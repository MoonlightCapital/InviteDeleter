exports.run = async (client, message) => {

  const msg = await message.channel.send(':ping_pong: Pong!');
  msg.edit(`:ping_pong: Pong! Latency: \`${msg.createdTimestamp - message.createdTimestamp}ms\`. API Latency: \`${Math.round(client.ping)}ms\``);


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
