
import hooks from './course_content.hooks.js'


export default function (app) {

   app.createService('course_content', app.get('prisma').course_content)
   app.service('course_content').hooks(hooks)

}
