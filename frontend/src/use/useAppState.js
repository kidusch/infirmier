
import { useSessionStorage } from '@vueuse/core'

// state backed in SessionStorage
const initialState = () => {
   return {
      isExpired: false,
      unexpectedError: false,
   }
}

const appState = useSessionStorage('app-state', initialState())

const resetUseAppState = () => {
   appState.value = initialState()
}


export function useAppState() {
   return {
      resetUseAppState,
      appState,
   }
}
