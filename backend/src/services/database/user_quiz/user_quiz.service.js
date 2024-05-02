
import hooks from './user_quiz.hooks.js'


export default function (app) {

   app.createService('user_quiz', app.get('prisma').user_quiz)
   app.service('user_quiz').hooks(hooks)

}
