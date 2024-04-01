
import bcrypt from 'bcryptjs'

import hooks from './auth.hooks.js'


export default function (app) {

   app.createService('auth', {

      localLogin: async (email, password) => {
         const prisma = app.get('prisma')
         // check existence of a user `sub`
         const user = await prisma.user.findUnique({ where: { email }})
         if (!user) throw new Error('wrong-credentials')
         // check its password
         const correct = await bcrypt.compare(password, user.password)
         if (!correct) throw new Error('wrong-credentials')
         return user
      },

      // see hooks
      logout: async () => {
         return 'ok'
      },

      setCnxUser: async (id) => {
         const prisma = app.get('prisma')
         const user = await prisma.user.findUnique({ where: { id }})
         return user
      },

      // see hooks
      getTimeLeftBeforeExpiration: async () => {
         return 0
      }
   })

   app.service('auth').hooks(hooks)
}
