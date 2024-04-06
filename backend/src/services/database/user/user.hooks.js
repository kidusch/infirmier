
// import { isAuthenticated, isNotExpired, extendExpiration, protect, hashPassword } from '@jcbuisson/express-x'
import { isAuthenticated, isNotExpired, extendExpiration, protect, hashPassword } from '#root/src/common-hooks.mjs'

export default {
   before: {
      all: [isAuthenticated, isNotExpired, protect('password')],

      create: [hashPassword('password')],
      update: [hashPassword('password')],
   },
   after: {
      all: [extendExpiration],
   }
}
