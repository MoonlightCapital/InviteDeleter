const {greentick, redtick} = require('../includes/emotes')
const {logHook} = require('../includes/logging')
const cp = require('child_process')

function update(branch) {
  return new Promise(function(resolve, reject) {
    resolve(cp.exec(`git fetch origin && git reset --hard origin/${branch}`))
  })
}

exports.run = async (client, message, args) => {

  const msg = await message.channel.send(`${greentick} Update started...`)

  update(args[0]).then(() => {
    msg.edit(`${greentick} Bot updated successfully. Remember to restart in order to make changes effective`)
  }).catch((e) => {
    console.error(e)
    msg.edit(`${redtick} Something went wrong while updating`)
  })

  process.exit(0)
}

exports.help = {
  name: 'update',
  info: 'Updates the bot',
  usage: '<branch>',
  unlisted: true,
}

exports.config = {
  guildOnly: false,
  ownerOnly: true,
  aliases: [],
  minLevel: 10,
  cooldown: 0,
}
