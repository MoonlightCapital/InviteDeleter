const debug = {
  server: '314116801975943198',
  role: '463335757571031057',
  minServerSize: 1,
  inEvent: false
}

const production = {
  server: '',
  role: '',
  minServerSize: 322,
  inEvent: false
}

module.exports = process.env.NODE_ENV === 'production' ?  production : debug
