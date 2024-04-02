
import { isNotExpired, protect, hashPassword } from '@jcbuisson/express-x'

export default {
   before: {
      all: [isNotExpired, protect('password')],

      create: [hashPassword('password')],
      update: [hashPassword('password')],
   },
}
