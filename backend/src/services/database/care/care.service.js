
import hooks from './care.hooks.js'


export default function (app) {

   app.createService('care', app.get('prisma').care)
   app.service('care').hooks(hooks)

}
