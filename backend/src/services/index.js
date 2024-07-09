
// database services
import userService from './database/user/user.service.js'
import adminMiscService from './database/admin_misc/admin_misc.service.js'
import ueService from './database/ue/ue.service.js'
import subUEService from './database/sub_ue/sub_ue.service.js'
import topicService from './database/topic/topic.service.js'
import courseService from './database/course/course.service.js'
import cardService from './database/card/card.service.js'
import caseStudyService from './database/case_study/case_study.service.js'
import quizService from './database/quiz/quiz.service.js'
import quizChoiceService from './database/quiz_choice/quiz_choice.service.js'
import userActionService from './database/user_action/user_action.service.js'
import userTopicService from './database/user_topic/user_topic.service.js'
import userCourseService from './database/user_course/user_course.service.js'
import userCardService from './database/user_card/user_card.service.js'
import userQuizService from './database/user_quiz/user_quiz.service.js'
import userQuizChoiceService from './database/user_quiz_choice/user_quiz_choice.service.js'
import userCaseStudyService from './database/user_case_study/user_case_study.service.js'

import careService from './database/care/care.service.js'
import documentService from './database/document/document.service.js'
import legislationService from './database/legislation/legislation.service.js'

import lexiconService from './database/lexicon/lexicon.service.js'
import messageService from './database/message/message.service.js'

// custom services
import mailService from './custom/mail/mail.service.js'
import authService from './custom/auth/auth.service.js'
import notificationService from './custom/notification/notification.service.mjs'


export default function (app) {
   // add database services
   app.configure(userService)
   app.configure(adminMiscService)
   app.configure(ueService)
   app.configure(subUEService)
   app.configure(topicService)
   app.configure(courseService)
   app.configure(cardService)
   app.configure(caseStudyService)
   app.configure(quizService)
   app.configure(quizChoiceService)
   app.configure(userActionService)
   app.configure(userTopicService)
   app.configure(userCourseService)
   app.configure(userCardService)
   app.configure(userQuizService)
   app.configure(userQuizChoiceService)
   app.configure(userCaseStudyService)

   app.configure(careService)
   app.configure(documentService)
   app.configure(legislationService)

   app.configure(lexiconService)
   app.configure(messageService)

   // add custom services
   app.configure(mailService)
   app.configure(authService)
   app.configure(notificationService)
}
