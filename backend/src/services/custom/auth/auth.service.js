
import bcrypt from 'bcryptjs'

import hooks from './auth.hooks.js'


export default function (app) {

   app.createService('auth', {

      login: async (sub, password) => {
         const prisma = app.get('prisma')
         // check existence of a user `sub`
         const user = await prisma.user.findUnique({ where: { sub }})
         if (!user) throw new Error('wrong-credentials')
         // check its password
         const correct = await bcrypt.compare(password, user.password)
         if (!correct) throw new Error('wrong-credentials')

         // create a new session
         const session = await prisma.session.create({
            data: {
               startTime: new Date(),
               endTime: new Date(),
            }
         })
         return { user, session }
      },

      logout: async () => {
         // result { userId, sessionId } is set by 'after' hook
         return 'dummy'
      },

      setPassword: async (sub, password) => {
         const prisma = app.get('prisma')
         password = await bcrypt.hash(password, 5)
         const user = await prisma.user.update({
            where: { sub },
            data: { password }
         })
         console.log('setPassword', user)
         return user.id
      },

      // see 'after' hook
      logout: async () => {
         return 'ok'
      },

      // if not authenticated, return undefined
      // if there is no time left, return true, otherwise return false
      // see 'after' hook
      checkAndExtendExpiration: async () => {
         return 'ok'
      },

      // return undefined if there are no connection data
      // otherwise, return (now - expirationDate) in ms: positive if there is time left, negative otherwise
      // DOES NOT EXTEND SESSION
      // see 'after' hook
      getTimeLeftBeforeExpiration: async () => {
         return 0
      }

   })

   app.service('auth').hooks(hooks)
}
