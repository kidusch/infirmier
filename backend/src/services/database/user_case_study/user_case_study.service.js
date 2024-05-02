
import hooks from './user_case_study.hooks.js'


export default function (app) {

   app.createService('user_case_study', app.get('prisma').user_case_study)
   app.service('user_case_study').hooks(hooks)

}
