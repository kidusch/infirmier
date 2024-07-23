
import hooks from './anatomy.hooks.js'


export default function (app) {

   app.createService('anatomy', app.get('prisma').anatomy)
   app.service('anatomy').hooks(hooks)

}
