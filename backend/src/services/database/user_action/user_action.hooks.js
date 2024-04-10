
import { isAuthenticated, isNotExpired, extendExpiration, protect } from '@jcbuisson/express-x'
// import { isAuthenticated, isNotExpired, extendExpiration, protect } from '#root/src/server.mjs'

import config from '#config'


export default {
   before: {
      all: [isAuthenticated, isNotExpired],
   },
   after: {
      all: [extendExpiration(config.SESSION_EXPIRE_DELAY)],
   }
}
