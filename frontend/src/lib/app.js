import pegjs from './grammar.js'

const res = pegjs.parse(`
# Structure de la cellule

xx yy zz
cc vv

- kkjl {ml} bb
- cvs zghdkjz

Voir 😀 {chapitre} structure de la [cellule]{lexique cellule}
aa bb
`)

console.log('res', res)

