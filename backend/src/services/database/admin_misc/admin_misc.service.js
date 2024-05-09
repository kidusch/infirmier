
import hooks from './admin_misc.hooks.js'


export default function (app) {

   app.createService('admin_misc', app.get('prisma').admin_misc)
   app.service('admin_misc').hooks(hooks)

}
