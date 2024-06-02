
import hooks from './user_course.hooks.js'


export default function (app) {

   app.createService('user_course', app.get('prisma').user_course)
   app.service('user_course').hooks(hooks)

}
