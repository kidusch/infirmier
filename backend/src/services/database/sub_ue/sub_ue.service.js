
import hooks from './sub_ue.hooks.js'


export default function (app) {

   app.createService('sub_ue', app.get('prisma').sub_ue)
   app.service('sub_ue').hooks(hooks)

}
