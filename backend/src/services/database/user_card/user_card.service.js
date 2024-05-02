
import hooks from './user_card.hooks.js'


export default function (app) {

   app.createService('user_card', app.get('prisma').user_card)
   app.service('user_card').hooks(hooks)

}
