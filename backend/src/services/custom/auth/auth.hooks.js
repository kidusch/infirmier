
async function afterLogin(context) {
   // add user to socket data
   const user = context.result
   context.socket.data.user = user
   // set expiration time
   const now = new Date()
   const sessionExpireDelay = context.app.get('config').SESSION_EXPIRE_DELAY
   const updatedExpirationDate = new Date(now.getTime() + sessionExpireDelay)
   context.socket.data.expiresAt = updatedExpirationDate
   // add socket to "authenticated" channel
   context.app.joinChannel('authenticated', context.socket)
}

function afterLogout(context) {
   // clear connection data
   context.socket.data = {}
   // leave all rooms except socket#id
   const rooms = new Set(context.socket.rooms)
   for (const room of rooms) {
      if (room === context.socket.id) continue
      context.socket.leave(room)
   }
}

async function beforeGetTimeLeftBeforeExpiration(context) {
   context.result = context.socket.data.expiresAt
}

export default {
   before: {
      getTimeLeftBeforeExpiration: [beforeGetTimeLeftBeforeExpiration],
   },
   after: {
      localLogin: [afterLogin],
      logout: [afterLogout],
      setCnxUser: [afterLogin]
   },
}
