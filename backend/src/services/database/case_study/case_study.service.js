
import hooks from './case_study.hooks.js'


export default function (app) {

   app.createService('case_study', app.get('prisma').case_study)
   app.service('case_study').hooks(hooks)

}
