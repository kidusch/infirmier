
import { isNotExpired } from '@jcbuisson/express-x'
import bcrypt from 'bcryptjs'


// hash password of user record
const hashPassword = (passwordField) => async (context) => {
   const data = context.args[0]
   if (data?.data[passwordField]) {
      data.data[passwordField] = await bcrypt.hash(data.data[passwordField], 5)
   }
   return context
}


export default {
   before: {
      all: [isNotExpired],

      create: [hashPassword('password')],
      update: [hashPassword('password')],
   },
}
