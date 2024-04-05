
class NotAuthenticatedError extends Error {
   constructor(message) {
      super(message)
      this.code = 'not-authenticated'
   }
}

export const isNotExpired = async (context) => {
   // do nothing if it's not a client call from a ws connexion
   if (!context.socket) return
   const expiresAt = context.socket.data.expiresAt
   if (expiresAt) {
      const expiresAtDate = new Date(expiresAt)
      const now = new Date()
      if (now > expiresAtDate) {
         // expiration date is met: clear socket.data & throw exception
         context.socket.data = {}
         throw new NotAuthenticatedError("Session expired")
      }
   } else {
      throw new NotAuthenticatedError("no expiresAt in socket.data")
   }
}

/*
 * Throw an error for a client service method call when socket.data does not contain user
*/
export const isAuthenticated = async (context) => {
   // do nothing if it's not a client call from a ws connexion
   if (!context.socket) return
   if (!context.socket.data.user) throw new NotAuthenticatedError('no user in socket.data')
}
