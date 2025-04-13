// import { GoogleAuth } from '@codetrix-studio/capacitor-google-auth'
// import { GoogleAuth } from 'jcb-capacitor-googleauth'
import { SocialLogin } from '@capgo/capacitor-social-login'

import { app } from '/src/client-app.js'

import { resetUseAppState } from '/src/use/useAppState'
import { resetUseUser } from '/src/use/useUser'
import { resetUseUE } from '/src/use/useUE'
import { resetUseSubUE } from '/src/use/useSubUE'
import { resetUseTopic } from '/src/use/useTopic'
import { resetUseCourse } from '/src/use/useCourse'
import { resetUseCourseContent } from '/src/use/useCourseContent'
import { resetUseCard } from '/src/use/useCard'
import { resetUseCaseStudy } from '/src/use/useCaseStudy'
import { resetUseQuiz } from '/src/use/useQuiz'
import { resetUseQuizChoice } from '/src/use/useQuizChoice'
import { resetUseUserCourse } from '/src/use/useUserCourse'
import { resetUseUserCard } from '/src/use/useUserCard'
import { resetUseUserQuiz } from '/src/use/useUserQuiz'
import { resetUseUserQuizChoice } from '/src/use/useUserQuizChoice'
import { resetUseUserCaseStudy } from '/src/use/useUserCaseStudy'
import { resetUseCare } from '/src/use/useCare'
import { resetUseDocument } from '/src/use/useDocument'
import { resetUseAnatomy } from '/src/use/useAnatomy'
import { resetUseLegislation } from '/src/use/useLegislation'
import { resetUseLexicon } from '/src/use/useLexicon'
import { resetUseMessage } from '/src/use/useMessage'
import { resetUseAgenda } from '/src/use/useAgenda'

import router from '/src/router'


export function clearCaches() {
   console.log('clearCaches')

   sessionStorage.removeItem('userid')
   
   // resetUseAuthentication()
   resetUseAppState()
   resetUseUser()
   resetUseUE()
   resetUseSubUE()
   resetUseTopic()
   resetUseCourse()
   resetUseCourseContent()
   resetUseCard()
   resetUseQuiz()
   resetUseCaseStudy()
   resetUseQuizChoice()
   resetUseUserCourse()
   resetUseUserCard()
   resetUseUserQuiz()
   resetUseUserQuizChoice()
   resetUseUserCaseStudy()
   resetUseCare()
   resetUseDocument()
   resetUseAnatomy()
   resetUseLegislation()
   resetUseLexicon()
   resetUseMessage()
   resetUseAgenda()
}

export const restartApp = async () => {
   clearCaches()
   try {
      // can fail if connection is broken
      await app.service('auth').logout()
   } catch(err) {}
   router.push('/')
}


////////////////////////           LOGIN / LOGOUT            ////////////////////////

// throws an error 'wrong-credentials' if wrong email / password
export async function localSignin(email, password) {
   const user = await app.service('auth').localSignin('email', email, password)
   await addUserAction(user.id, 'login')
   return user
}

export async function googleSignin(googleUser) {
   const user = await app.service('auth').googleSignin(googleUser)
   await addUserAction(user.id, 'login')
   return user
}

export async function logout(user) {
   if (user.google_id) {
      // GoogleAuth.signOut()
      SocialLogin.signOut()
   }

   await addUserAction(user.id, 'logout')

   clearCaches()

   try {
      await app.service('auth').logout()
   } catch(err) {
      console.log('logout err', err)
   }
}

export async function addUserAction(user_id, action) {
   try {
      await app.service('user_action').create({ data: {
         user_id,
         action,
      }})
   } catch(err) {
      console.log('addUserAction err', err)
   }
}
