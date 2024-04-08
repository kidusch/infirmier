
import config from '#config'

import { isAuthenticated, isNotExpired } from '@jcbuisson/express-x'
// import { isAuthenticated, isNotExpired } from '#root/src/server.mjs'


async function afterAuthentication(context) {
   // set socket.data.user
   console.log('socket.data.user set by afterAuthentication')
   context.socket.data.user = Object.assign({}, context.result)
   // set socket.data.expiresAt
   const now = new Date()
   console.log('socket.data.expiresAt set by afterAuthentication')
   context.socket.data.expiresAt = new Date(now.getTime() + config.SESSION_EXPIRE_DELAY)
   // add socket to "authenticated" channel
   context.app.joinChannel('authenticated', context.socket)
   // remove password field from result
   delete context.result.password
}

function afterSignout(context) {
   // clear connection data
   context.socket.data = {}
   // leave all rooms except socket#id
   const rooms = new Set(context.socket.rooms)
   for (const room of rooms) {
      if (room === context.socket.id) continue
      context.socket.leave(room)
   }
}

async function afterGetCnxInfo(context) {
   console.log('context.socket.data', context.socket.data)
   console.log('context.socket.rooms', context.socket.rooms)
   context.result = context.socket.data.expiresAt
}

export default {
   before: {
      ping: [isAuthenticated, isNotExpired],
   },
   after: {
      localSignin: [afterAuthentication],
      localSignup: [afterAuthentication],
      logout: [afterSignout],
      getCnxInfo: [afterGetCnxInfo],
   },
}
