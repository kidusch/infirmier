
import hooks from './user_quiz_choice.hooks.js'


export default function (app) {

   app.createService('user_quiz_choice', app.get('prisma').user_quiz_choice)
   app.service('user_quiz_choice').hooks(hooks)

}
