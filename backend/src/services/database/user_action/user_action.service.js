
import hooks from './user_action.hooks.js'


export default function (app) {

   app.createService('user_action', app.get('prisma').user_action)

   // causes issues on logout
   // app.service('user_action').hooks(hooks)

}
