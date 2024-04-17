
import hooks from './topic.hooks.js'


export default function (app) {

   app.createService('topic', app.get('prisma').topic)
   app.service('topic').hooks(hooks)

}
