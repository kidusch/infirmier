
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

import hooks from './auth.hooks.js'
import config from '#config'

import { EXError } from '@jcbuisson/express-x'


export default function (app) {

   const prisma = app.get('prisma')

   app.createService('auth', {

      localSignin: async (email, password) => {
         // check existence of a user with `email`
         const user = await prisma.user.findUnique({ where: { email }})
         if (!user) throw new EXError('wrong-credentials', "Wrong credendials")
         // check its password
         const correct = await bcrypt.compare(password, user.password)
         if (!correct) throw new EXError('wrong-credentials', "Wrong credendials")
         return user
      },

      localSignup: async (email, name) => {
         // check existence of a user with `email`
         const user = await prisma.user.findUnique({ where: { email }})
         if (user) throw new EXError('email-already-used', "Email already used")
         // create user
         const createdUser = await prisma.user.create({
            data: {
               email,
               name,
            }
         })
         // send confirmation email
         const token = jwt.sign({ userid: createdUser.id }, config.SECRET)
         await app.service('mail').send({
            from: 'buisson@enseeiht.fr',
            to: email,
            subject: "Création compte Journal de bord Infirmier",
            text: `Cliquez <a href="${config.CLIENT_URL}/signup-confirm/${token}">sur ce lien</a> pour confirmer votre inscription`,
         })
         return createdUser
      },

      // see hooks
      logout: async () => {
         return 'ok'
      },

      setPassword: async (token, password) => {
         try {
            const payload = jwt.verify(token, config.SECRET)
            password = await bcrypt.hash(password, 5)
            const user = await prisma.user.update({
               where: { id: payload.userid },
               data: { password },
            })
            delete user.password
            console.log('userx', user)
            return user
         } catch(err) {
            if (err.code === 'jwt-error') {
               throw new EXError('jwt-error', "Could not verify JWT")
            } else {
               throw new EXError('unknown-error', err.message)
            }
         }
      },

      // see hooks
      getCnxInfo: async () => {
         return 0
      },

      // Do nothing - see hooks
      ping: async () => {
      }
   })

   app.service('auth').hooks(hooks)
}
