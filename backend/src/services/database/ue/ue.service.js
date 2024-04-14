
import hooks from './ue.hooks.js'


export default function (app) {

   app.createService('ue', app.get('prisma').ue)
   app.service('ue').hooks(hooks)

}
