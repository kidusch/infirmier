
import hooks from './highlighted_part.hooks.js'


export default function (app) {

   app.createService('highlighted_part', app.get('prisma').highlighted_part)
   app.service('highlighted_part').hooks(hooks)

}
