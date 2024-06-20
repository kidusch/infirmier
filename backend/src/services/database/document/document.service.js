
import hooks from './document.hooks.js'


export default function (app) {

   app.createService('document', app.get('prisma').document)
   app.service('document').hooks(hooks)

}
