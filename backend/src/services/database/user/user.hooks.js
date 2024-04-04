
import { isAuthenticated, isNotExpired, protect, hashPassword } from '@jcbuisson/express-x'

export default {
   before: {
      all: [isAuthenticated, isNotExpired, protect('password')],

      create: [hashPassword('password')],
      update: [hashPassword('password')],
   },
}
