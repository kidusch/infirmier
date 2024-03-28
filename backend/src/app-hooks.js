
import { debouncedFunction } from '#lib/utilities.mjs'


// Extend socket.data.expireAt with SESSION_EXPIRE_DELAY and update `endTime` of associated session with current time
async function extendSession(context) {
   // server-side app.service call: no socket in context
   if (!context.socket) return

   console.log('extendSession', context.socket.rooms, context.socket.data)

   const sessionId = context.socket.data.sessionId
   if (!sessionId) return // session is already expired

   // exception: do not extend expiration for service 'auth' and method 'getTimeLeftBeforeExpiration'
   if (context.methodName === 'getTimeLeftBeforeExpiration') return

   // compute new expiration time
   const sessionExpireDelay = context.app.get('config').SESSION_EXPIRE_DELAY
   const now = new Date()
   const updatedExpirationDate = new Date(now.getTime() + sessionExpireDelay)
   context.socket.data.expireAt = updatedExpirationDate

   // update 'endTime' of session with 'now'
   const prisma = context.app.get('prisma')
   await prisma.session.update({
      where: { id: sessionId },
      data: {
         endTime: now,
      }
   })

}


export default {
   // after all service calls
   after: [debouncedFunction(extendSession)],
}
