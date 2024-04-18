
import hooks from './quiz.hooks.js'


export default function (app) {

   app.createService('quiz', app.get('prisma').quiz)
   app.service('quiz').hooks(hooks)

}
