const list = {
  '-3': {
    level: -3,
    name: 'Malicious bot',
    icon: ':smiling_imp:'
  },
  '-2': {
    level: -2,
    name: 'Globally banned',
    icon: ':stop_sign:'
  },
  '-1': {
    level: -1,
    name: 'Blacklisted',
    icon: ':white_square_button:'
  },
  0: {
    level: 0,
    name: 'Normal user',
    icon: ':small_blue_diamond:'
  },
  1: {
    level: 1,
    name: 'Beta tester',
    icon: ':beginner:'
  },
  2: {
    level: 2,
    name: 'Donor',
    icon: ':moneybag:'
  },
  3: {
    level: 3,
    name: 'Bot staff',
    icon: ':wrench:'
  },
  4: {
    level: 4,
    name: 'Global moderator',
    icon: ':crossed_swords:'
  },
  5: {
    level: 5,
    name: 'Global admin',
    icon: '<:gnome:576402139639971860>'
  },
  
  9: {
    level: 9,
    name: 'Da bot',
    icon: ':shield:'
  },
  10: {
    level: 10,
    name: 'Bot owner',
    icon: ':star2:'
  },
}

function getLevelTag(lvl) {
  const level = list[lvl]
  if(!level) return

  return `${level.icon} **${level.name}**`
}

function getLevelInfo(lvl) {
  const level = list[lvl]
  if(!level) return

  return level
}

module.exports = {getLevelTag, getLevelInfo}
