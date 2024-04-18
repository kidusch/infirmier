
import hooks from './card.hooks.js'


export default function (app) {

   app.createService('card', app.get('prisma').card)
   app.service('card').hooks(hooks)

}
