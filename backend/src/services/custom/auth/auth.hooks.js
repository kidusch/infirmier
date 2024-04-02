
async function afterAuthentication(context) {
   // add user to socket data
   context.socket.data.user = Object.assign({}, context.result)
   // set expiration time
   const now = new Date()
   const sessionExpireDelay = context.app.get('config').SESSION_EXPIRE_DELAY
   const updatedExpirationDate = new Date(now.getTime() + sessionExpireDelay)
   context.socket.data.expiresAt = updatedExpirationDate
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

async function beforeGetExpirationTime(context) {
   context.result = context.socket.data.expiresAt
}

export default {
   before: {
      getExpirationTime: [beforeGetExpirationTime],
   },
   after: {
      localSignin: [afterAuthentication],
      localSignup: [afterAuthentication],
      setCnxUser: [afterAuthentication],
      signout: [afterSignout],
   },
}
