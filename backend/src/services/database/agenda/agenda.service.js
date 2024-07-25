
import hooks from './agenda.hooks.js'


export default function (app) {

   app.createService('agenda', app.get('prisma').agenda)
   app.service('agenda').hooks(hooks)

}
