
import { useSessionStorage } from '@vueuse/core'

// state backed in SessionStorage
const initialState = () => ({
   isExpired: false,
   unrecoverableError: false,
   isWaiting: false,
})

const key = 'app-state'
export const appState = useSessionStorage(key, initialState())

export const resetUseAppState = () => {
   // appState.value = initialState()
   sessionStorage.removeItem(key)
}
