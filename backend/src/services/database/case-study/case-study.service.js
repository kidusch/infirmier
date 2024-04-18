
import hooks from './case-study.hooks.js'


export default function (app) {

   app.createService('case-study', app.get('prisma').case_study)
   app.service('case-study').hooks(hooks)

}
