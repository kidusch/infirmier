
import hooks from './message.hooks.js'


export default function (app) {

   app.createService('message', app.get('prisma').message)
   app.service('message').hooks(hooks)

}
