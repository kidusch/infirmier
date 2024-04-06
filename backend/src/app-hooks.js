
import config from '#config'

async function extendExpiration(context) {
   // do nothing if not ws client call
   if (!context.socket) return

   // do nothing if not authenticated
   if (!context.socket.data.user) return

   // do nothing for auth/getCnxInfo'
   if (context.methodName === 'getCnxInfo') return
   if (context.methodName === 'ping') return

   const now = new Date()
   if (now > context.socket.data.expiresAt) {
      // socket.data.expiresAt is overdue
      // clear connection data
      context.socket.data = {}
      // leave all rooms except socket#id
      const rooms = new Set(context.socket.rooms)
      for (const room of rooms) {
         if (room === context.socket.id) continue
         context.socket.leave(room)
      }
      // send an event to the client (client reaction: logout)
      context.socket.emit('expired')
   } else {
      // compute new expiration time
      console.log('extend caused by', context.methodName)
      context.socket.data.expiresAt = new Date(now.getTime() + config.SESSION_EXPIRE_DELAY)
   }
}

export default {
   // Before all service calls
   // Must be done before and not after, otherwise this hook is never run in case of error
   before: [extendExpiration],
}
