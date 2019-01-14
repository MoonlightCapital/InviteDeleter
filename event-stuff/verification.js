const event = require('./constants.js')

const admissionPerms = ['MANAGE_GUILD', 'KICK_MEMBERS', 'BAN_MEMBERS', 'MANAGE_ROLES', 'ADMINISTRATOR']

const serverCheck = (client, uid) => client.guilds.get(event.server).members.has(uid)

const permissionCheck = (member) => admissionPerms.some(p=>member.permissions.has(p))

const memberCheck = (guild) => guild.members.filter(m=>!m.user.bot).size >= event.minServerSize

module.exports = {serverCheck, permissionCheck, memberCheck}
