
import hooks from './lexicon.hooks.js'


export default function (app) {

   app.createService('lexicon', app.get('prisma').lexicon)
   app.service('lexicon').hooks(hooks)

}
