
import { useSessionStorage } from '@vueuse/core'

// state backed in SessionStorage
const initialState = () => ({
   isExpired: false,
   unrecoverableError: false,
   isWaiting: false,
})

export const appState = useSessionStorage('app-state', initialState())

export const resetUseAppState = () => {
   appState.value = initialState()
}
