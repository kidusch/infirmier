

// DO NOT DEBOUNCE: throwing the error crashes the backend
async function extendSession(context) {
   // console.log('extendSession', context.socket.rooms, context.socket.data)

   // do nothing if server-side app.service call
   if (!context.socket) return

   // do nothing if no user is logged in
   if (!context.socket.data.user) return

   // do nothing for auth/getExpirationTime'
   if (context.methodName === 'getExpirationTime') return

   // throws an error on expiration
   const now = new Date()
   if (now > context.socket.data.expiresAt) {
      // clear connection data
      context.socket.data = {}
      // leave all rooms except socket#id
      const rooms = new Set(context.socket.rooms)
      for (const room of rooms) {
         if (room === context.socket.id) continue
         context.socket.leave(room)
      }
      // throw new Error('expired')
   }

   // compute new expiration time
   const sessionExpireDelay = context.app.get('config').SESSION_EXPIRE_DELAY
   const updatedExpirationDate = new Date(now.getTime() + sessionExpireDelay)
   context.socket.data.expiresAt = updatedExpirationDate
}


export default {
   // after all service calls
   after: [extendSession],
}
