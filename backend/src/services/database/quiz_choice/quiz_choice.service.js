
import hooks from './quiz_choice.hooks.js'


export default function (app) {

   app.createService('quiz_choice', app.get('prisma').quiz_choice)
   app.service('quiz_choice').hooks(hooks)

}
