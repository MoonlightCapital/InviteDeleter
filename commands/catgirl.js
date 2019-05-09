const {greentick, yellowtick, redtick} = require('../includes/emotes')
const {RichEmbed} = require('discord.js')
const fetch = require('node-fetch')

exports.run = async (client, message) => {

  fetch('https://nekos.moe/api/v1/random/image?nsfw=false', {
    headers: {
      'user-agent': 'InviteDeleter (https://github.com/MoonlightCapital/InviteDeleter)'
    }
  }).then(res => {
    if(!res.ok)
      return message.channel.send(`${redtick} Something went wrong while trying to fetch the image. API returned a status code of \`${res.status}\``)

    return res.json()
  }).then(data => {
    const image = data.images[0]

    const embed = new RichEmbed()
    .setTitle('Here\'s your catgirl')
    .setImage(`https://nekos.moe/image/${image.id}`)
    .setFooter('Kindly provided by https://nekos.moe')

    message.channel.send(embed)
  })
}

exports.help = {
  name: 'catgirl',
  info: 'Shows a (SFW) catgirl image',
  usage: '',
  unlisted: false,
}

exports.config = {
  guildOnly: false,
  ownerOnly: false,
  aliases: ['neko'],
  minLevel: 0,
  cooldown: 1,
}
