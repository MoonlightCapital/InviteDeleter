module.exports = {
  escapeMarkdown: text => text.replace(/(`|\*|_)/gmi, '\\$1'),

  parseMention: mention => mention.replace(/\D/gmi, ''),
}
