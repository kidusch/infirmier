import _ from 'lodash'
import { format } from 'date-fns'
import XRegExp from 'xregexp'


export function formattedName(text) {
   // return text.replace('/^/g', ' ').replace('/\_/g', ' ')
   return text.replace('^', ' ').replace('_', ' ')
}

export function formatDate(date) {
   return format(new Date(date), 'dd/MM/yyyy')
}

export function formattedDatetime(datetime) {
   return format(new Date(datetime), 'dd/MM/yyyy HH:mm:ss')
}

export function timeout(ms) {
   return new Promise(resolve => setTimeout(resolve, ms));
}

export function debouncedFunction(func, wait=500, maxWait=5000) {
   return _.debounce(func, wait, { maxWait })
}

export function openUrl(url) {
   if (url) {
      window.open(url, "_blank")
   }
}

export function secondsToHms(d) {
    d = Number(d)
    var h = Math.floor(d / 3600)
    var m = Math.floor(d % 3600 / 60)
    var s = Math.floor(d % 3600 % 60)

    var hDisplay = h > 0 ? h + (h == 1 ? "h " : "h ") : ""
    var mDisplay = m > 0 ? m + (m == 1 ? "mn " : "mn ") : ""
    var sDisplay = s > 0 ? s + (s == 1 ? "s" : "s") : ""
    return hDisplay + mDisplay + sDisplay
}

export function urlB64ToUint8Array(base64String) {
   const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
   const base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/')
   const rawData = atob(base64)
   const outputArray = new Uint8Array(rawData.length)
   for (let i = 0; i < rawData.length; ++i) {
     outputArray[i] = rawData.charCodeAt(i)
   }
   return outputArray
}

export async function getWebPushSubscription() {
   try {
      const register = await navigator.serviceWorker.register('/sw.js', {
         scope: '/'
      })
      const subscription = await register.pushManager.subscribe({
         userVisibleOnly: true,
         applicationServerKey: urlB64ToUint8Array(import.meta.env.VITE_APP_VAPID_PUBLIC_KEY),
      })
      console.log('subscription', subscription)
      return subscription
   } catch(err) {
      console.log("*** pb with push registration (Safari ?)", err.message)
   }
}

const frenchPhoneRE = XRegExp(`
   ^
   (?: (0|[\+]33))                 # dial: "0" or "+33"
   (?: [ .-]*)  (?<first> [0-9])   # first digit
   (?: [ .-]*)  (?<d1> [0-9])      # 8 next digits
   (?: [ .-]*)  (?<d2> [0-9])
   (?: [ .-]*)  (?<d3> [0-9])
   (?: [ .-]*)  (?<d4> [0-9])
   (?: [ .-]*)  (?<d5> [0-9])
   (?: [ .-]*)  (?<d6> [0-9])
   (?: [ .-]*)  (?<d7> [0-9])
   (?: [ .-]*)  (?<d8> [0-9])
   $
`, 'x')

export function testFrenchPhoneNumber(str) {
   return XRegExp.test(str, frenchPhoneRE)
}

export function parseFrenchPhoneNumber(str) {
   const isValid = XRegExp.test(str, frenchPhoneRE)
   return {
      isValid,
      normalized: isValid && XRegExp.replace(str, frenchPhoneRE, '+33 $<first> $<d1>$<d2> $<d3>$<d4> $<d5>$<d6> $<d7>$<d8>'),
   }
}


const emailRE = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

export function testEmail(str) {
   return emailRE.test(str)
}

export function generateUID(length) {
   const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
   let uid = '';

   for (let i = 0; i < length; i++) {
     const randomIndex = Math.floor(Math.random() * characters.length)
     uid += characters.charAt(randomIndex)
   }
   return uid
}

export function readFileAsyncAsText(file) {
   return new Promise((resolve, reject) => {
      const reader = new FileReader()
      
      reader.onload = function(e) {
         resolve(e.target.result)
      }

      reader.onerror = function(e) {
         reject(new Error('Error reading file'))
      };

      reader.readAsText(file) // Read file content as text
   })
}

export function readFileAsyncAsArrayBuffer(file) {
   return new Promise((resolve, reject) => {
      const reader = new FileReader()
      
      reader.onload = function(e) {
         resolve(e.target.result)
      }

      reader.onerror = function(e) {
         reject(new Error('Error reading file'))
      }

      reader.readAsArrayBuffer(file)
   })
}

export function readURIAsArrayBuffer(uri) {
   return new Promise((resolve, reject) => {
      const reader = new FileReader()

      fetch(uri)
      .then(res => res.blob())
      .then(blob => {
         reader.readAsArrayBuffer(blob)
      })

      reader.onload = function(e) {
         resolve(e.target.result)
      }

      reader.onerror = function(e) {
         reject(new Error('Error reading file'))
      }
   })
}
