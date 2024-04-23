
import hooks from './user_topic.hooks.js'


export default function (app) {

   app.createService('user_topic', app.get('prisma').user_topic)
   app.service('user_topic').hooks(hooks)

}
