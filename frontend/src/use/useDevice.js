import { computed } from 'vue'
import { Capacitor } from '@capacitor/core'
import { useScreenOrientation } from '@vueuse/core'

const { orientation } = useScreenOrientation()

export const isMobilePortrait = computed(() => Capacitor.getPlatform() !== 'web' && orientation.value === 'portrait-primary')
