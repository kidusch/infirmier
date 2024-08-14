
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
         const adminMisc = await prisma.admin_misc.findUnique({ where: { id: 1 }})
         await app.service('mail').send({
            from: 'buisson@enseeiht.fr',
            to: email,
            subject: "Création compte Journal de bord Infirmier",
            text: `${adminMisc.email}<br><br>Cliquez <a href="${config.CLIENT_URL}/local-signup-confirm/${token}">sur ce lien</a> pour confirmer votre inscription`,
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
               data: {
                  accept_cgu: true,
                  password
               },
            })
            delete user.password
            return user
         } catch(err) {
            if (err.code === 'jwt-error') {
               throw new EXError('jwt-error', "Could not verify JWT")
            } else {
               throw new EXError('unknown-error', err.message)
            }
         }
      },

      forgottenPassword: async (email) => {
         console.log('forgottenPassword', email)
         // check existence of a user with `email`
         const user = await prisma.user.findUnique({ where: { email }})
         if (!user) return
         // send reset password email
         const token = jwt.sign({ userid: user.id }, config.SECRET)
         await app.service('mail').send({
            from: 'buisson@enseeiht.fr',
            to: email,
            subject: "Journal de bord Infirmier, réinitialisation du mot de passe",
            text: `Cliquez <a href="${config.CLIENT_URL}/set-password/${token}">sur ce lien</a> pour réinitialiser votre mot de passe`,
         })
      },

      // Do nothing - see hooks
      checkAndExtend: async () => {
      },
   })

   app.service('auth').hooks(hooks)
}
