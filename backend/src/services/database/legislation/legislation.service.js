
import hooks from './legislation.hooks.js'


export default function (app) {

   app.createService('legislation', app.get('prisma').legislation)
   app.service('legislation').hooks(hooks)

}
