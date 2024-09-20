import { computed } from 'vue'
import { Capacitor } from '@capacitor/core'
import { useScreenOrientation } from '@vueuse/core'

const { orientation } = useScreenOrientation()

export const isIosPortrait = computed(() => Capacitor.getPlatform() === 'ios' && orientation.value === 'portrait-primary')
