
import { useSessionStorage } from '@vueuse/core'

// state backed in SessionStorage
const initialState = () => ({
   isExpired: false,
   unexpectedError: false,
   isWaiting: false,
})

export const appState = useSessionStorage('app-state', initialState())

export const resetUseAppState = () => {
   appState.value = initialState()
}
