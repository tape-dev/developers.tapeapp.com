// Dark code colours (GitHub-dark style palette, as on the reference in dark mode), own Prism theme
module.exports = {
  plain: { color: '#E6EDF3', backgroundColor: '#0B0C0E' },
  styles: [
    { types: ['comment', 'prolog', 'doctype', 'cdata'], style: { color: '#8B949E' } },
    { types: ['keyword', 'operator', 'important', 'atrule', 'selector'], style: { color: '#FF7B72' } },
    { types: ['string', 'char', 'attr-value', 'template-string', 'regex', 'url'], style: { color: '#A5D6FF' } },
    { types: ['number', 'boolean', 'constant', 'variable', 'symbol', 'builtin', 'class-name', 'parameter'], style: { color: '#79C0FF' } },
    { types: ['function'], style: { color: '#D2A8FF' } },
    { types: ['property', 'attr-name', 'tag', 'key'], style: { color: '#7EE787' } },
    { types: ['punctuation'], style: { color: '#E6EDF3' } },
    { types: ['deleted'], style: { color: '#FFA198', backgroundColor: 'rgba(248,81,73,0.15)' } },
    { types: ['inserted'], style: { color: '#7EE787', backgroundColor: 'rgba(46,160,67,0.15)' } },
  ],
};
