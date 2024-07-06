import { ref, onMounted, onUnmounted } from "vue"


const screenWidth = ref(window.innerWidth)
const screenHeight = ref(window.innerHeight)

const isMobile = ref(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent))


export function useWindowSize() {

   onMounted(() => {
      window.addEventListener("resize", update)
   })
   
   onUnmounted(() => {
      window.removeEventListener("resize", update)
   })
   
   function update(e) {
      screenWidth.value = window.innerWidth
      screenHeight.value = window.innerHeight
   }
   
   return { screenWidth, screenHeight, isMobile }
}
