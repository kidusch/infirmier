
import bcrypt from 'bcryptjs'

import hooks from './auth.hooks.js'


export default function (app) {

   app.createService('auth', {

      localSignin: async (email, password) => {
         const prisma = app.get('prisma')
         // check existence of a user with `email`
         const user = await prisma.user.findUnique({ where: { email }})
         if (!user) throw new Error('wrong-credentials')
         // check its password
         const correct = await bcrypt.compare(password, user.password)
         if (!correct) throw new Error('wrong-credentials')
         return user
      },

      localSignup: async (email, name) => {
         const prisma = app.get('prisma')
         // check existence of a user with `email`
         const user = await prisma.user.findUnique({ where: { email }})
         if (user) throw new Error('email-already-used')
         // create user
         const createdUser = await prisma.user.create({
            data: {
               email,
               name,
            }
         })
         // send confirmation email
         await app.service('mail').send({
            from: 'buisson@enseeiht.fr',
            to: email,
            subject: "Création compte Journal de bord Infirmier",
            html: `Cliquez <a href="https://localhost:8000/confirm?userid=${createdUser.id}">ici</a>`,
         })
         return createdUser
      },

      // // see hooks
      // setCnxUser: async (id) => {
      //    const prisma = app.get('prisma')
      //    const user = await prisma.user.findUnique({ where: { id }})
      //    return user
      // },

      // see hooks
      signout: async () => {
         return 'ok'
      },

      // see hooks
      getExpirationTime: async () => {
         return 0
      }
   })

   app.service('auth').hooks(hooks)
}
