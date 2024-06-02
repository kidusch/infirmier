
import hooks from './course.hooks.js'


export default function (app) {

   app.createService('course', app.get('prisma').course)
   app.service('course').hooks(hooks)

}
