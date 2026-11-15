// Own Prism theme (GitHub-light style palette)
module.exports = {
  plain: { color: '#1F2328', backgroundColor: '#FFFFFF' },
  styles: [
    { types: ['comment', 'prolog', 'doctype', 'cdata'], style: { color: '#6E7781' } },
    { types: ['keyword', 'operator', 'important', 'atrule', 'selector'], style: { color: '#CF222E' } },
    { types: ['string', 'char', 'attr-value', 'template-string', 'regex', 'url'], style: { color: '#0A3069' } },
    { types: ['number', 'boolean', 'constant', 'variable', 'symbol', 'builtin', 'class-name', 'parameter'], style: { color: '#0550AE' } },
    { types: ['function'], style: { color: '#8250DF' } },
    { types: ['property', 'attr-name', 'tag', 'key'], style: { color: '#116329' } },
    { types: ['punctuation'], style: { color: '#1F2328' } },
    { types: ['deleted'], style: { color: '#82071E', backgroundColor: '#FFEBE9' } },
    { types: ['inserted'], style: { color: '#116329', backgroundColor: '#DAFBE1' } },
  ],
};
