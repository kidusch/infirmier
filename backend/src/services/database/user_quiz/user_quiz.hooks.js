
import { isAuthenticated, isNotExpired, extendExpiration, protect } from '#root/src/common-server.mjs'
import config from '#config'


export default {
   before: {
      all: [isAuthenticated, isNotExpired],
   },
   after: {
      all: [extendExpiration(config.SESSION_EXPIRE_DELAY)],
   }
}
