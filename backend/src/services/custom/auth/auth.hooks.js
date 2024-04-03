
async function afterAuthentication(context) {
   if (!context.socket.data.user) {
      // add user to socket data
      console.log('socket.data.user set by afterAuthentication')
      context.socket.data.user = Object.assign({}, context.result)
   }
   if (!context.socket.data.expiresAt) {
      // set expiration time
      const now = new Date()
      const sessionExpireDelay = context.app.get('config').SESSION_EXPIRE_DELAY
      const updatedExpirationDate = new Date(now.getTime() + sessionExpireDelay)
      console.log('socket.data.expiresAt set by afterAuthentication')
      context.socket.data.expiresAt = updatedExpirationDate
   }
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

async function afterGetExpirationTime(context) {
   console.log('context.socket.data', context.socket.data)
   console.log('context.socket.rooms', context.socket.rooms)
   context.result = context.socket.data.expiresAt
}

export default {
   before: {
   },
   after: {
      localSignin: [afterAuthentication],
      localSignup: [afterAuthentication],
      setCnxUser: [afterAuthentication],
      signout: [afterSignout],
      getExpirationTime: [afterGetExpirationTime],
   },
}
