
import { useSessionStorage } from '@vueuse/core'

// state backed in SessionStorage
const initialState = () => {
   return {
      isExpired: false,
      unexpectedError: false,
   }
}

const stateAppState = useSessionStorage('state-app-state', initialState())

const resetUseAppState = () => {
   stateAppState.value = initialState()
}


export function useAppState() {
   return {
      resetUseAppState,
      stateAppState,
   }
}
