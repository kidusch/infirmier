import { useSessionStorage } from '@vueuse/core'

import app from '/src/client-app.js'

import { resetUseAppState } from '/src/use/useAppState'
import { resetUseUser } from '/src/use/useUser'
import { resetUseUE } from '/src/use/useUE'
import { resetUseSubUE } from '/src/use/useSubUE'
import { resetUseTopic } from '/src/use/useTopic'
import { resetUseCard } from '/src/use/useCard'
import { resetUseCaseStudy } from '/src/use/useCaseStudy'
import { resetUseQuiz } from '/src/use/useQuiz'
import { resetUseQuizChoice } from '/src/use/useQuizChoice'
import { resetUseUserTopic } from '/src/use/useUserTopic'
import { resetUseUserCard } from '/src/use/useUserCard'
import { resetUseUserQuiz } from '/src/use/useUserQuiz'
import { resetUseUserQuizChoice } from '/src/use/useUserQuizChoice'
import { resetUseUserCaseStudy } from '/src/use/useUserCaseStudy'

import router from '/src/router'


// state backed in SessionStorage
const initialState = () => ({
   user: null,
})

const authenticationState = useSessionStorage('authentication-state', initialState())

export const resetUseAuthentication = () => {
   authenticationState.value = initialState()
}

export function clearSessionStorage() {
   resetUseAuthentication()
   resetUseAppState()
   resetUseUser()
   resetUseUE()
   resetUseSubUE()
   resetUseTopic()
   resetUseCard()
   resetUseCaseStudy()
   resetUseQuiz()
   resetUseQuizChoice()
   resetUseUserTopic()
   resetUseUserCard()
   resetUseUserQuiz()
   resetUseUserQuizChoice()
   resetUseUserCaseStudy()
}


////////////////////////           LOGIN / LOGOUT            ////////////////////////

// throws an error 'wrong-credentials' if wrong email / password
export async function localSignin(email, password) {
   const user = await app.service('auth').localSignin(email, password)
   await addUserAction(user.id, 'login')
   return user
}

export async function logout(userId) {
   try {
      await addUserAction(userId, 'logout')
   } catch(err) {
      console.log('err', err)
   }
   try {
      await app.service('auth').logout()
   } catch(err) {
      console.log('err', err)
   }
   clearSessionStorage()
   router.push('/')
}

export async function addUserAction(user_id, action) {
   await app.service('user_action').create({ data: {
      user_id,
      action,
   }})
}
