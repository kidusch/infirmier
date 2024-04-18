
// database services
import userService from './database/user/user.service.js'
import userActionService from './database/user_action/user_action.service.js'
import ueService from './database/ue/ue.service.js'
import subUEService from './database/sub_ue/sub_ue.service.js'
import topicService from './database/topic/topic.service.js'
import cardService from './database/card/card.service.js'
import caseStudyService from './database/case-study/case-study.service.js'
import quizService from './database/quiz/quiz.service.js'

// custom services
import mailService from './custom/mail/mail.service.js'
import authService from './custom/auth/auth.service.js'


export default function (app) {
   // add database services
   app.configure(userService)
   app.configure(userActionService)
   app.configure(ueService)
   app.configure(subUEService)
   app.configure(topicService)
   app.configure(cardService)
   app.configure(caseStudyService)
   app.configure(quizService)

   // add custom services
   app.configure(mailService)
   app.configure(authService)
}
