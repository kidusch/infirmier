
// database services
import userService from './database/user/user.service.js'
import adminMiscService from './database/admin_misc/admin_misc.service.js'
import ueService from './database/ue/ue.service.js'
import subUEService from './database/sub_ue/sub_ue.service.js'
import topicService from './database/topic/topic.service.js'
import cardService from './database/card/card.service.js'
import caseStudyService from './database/case-study/case-study.service.js'
import quizService from './database/quiz/quiz.service.js'
import quizChoiceService from './database/quiz_choice/quiz_choice.service.js'
import userActionService from './database/user_action/user_action.service.js'
import userTopicService from './database/user_topic/user_topic.service.js'
import userCardService from './database/user_card/user_card.service.js'
import userQuizService from './database/user_quiz/user_quiz.service.js'
import userQuizChoiceService from './database/user_quiz_choice/user_quiz_choice.service.js'
import userCaseStudyService from './database/user_case_study/user_case_study.service.js'
import highlightedPartService from './database/highlighted_part/highlighted_part.service.js'

// custom services
import mailService from './custom/mail/mail.service.js'
import authService from './custom/auth/auth.service.js'


export default function (app) {
   // add database services
   app.configure(userService)
   app.configure(adminMiscService)
   app.configure(ueService)
   app.configure(subUEService)
   app.configure(topicService)
   app.configure(cardService)
   app.configure(caseStudyService)
   app.configure(quizService)
   app.configure(quizChoiceService)
   app.configure(userActionService)
   app.configure(userTopicService)
   app.configure(userCardService)
   app.configure(userQuizService)
   app.configure(userQuizChoiceService)
   app.configure(userCaseStudyService)
   app.configure(highlightedPartService)

   // add custom services
   app.configure(mailService)
   app.configure(authService)
}
