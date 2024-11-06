
// reverse commented lines to alternate from npm version to debug version of ExpressX

// import { expressX as expressX_, isAuthenticated as isAuthenticated_, isNotExpired as isNotExpired_, extendExpiration as extendExpiration_, protect as protect_ } from '@jcbuisson/express-x'
import { expressX as expressX_, isAuthenticated as isAuthenticated_, isNotExpired as isNotExpired_, extendExpiration as extendExpiration_, protect as protect_ } from '#root/src/server.mjs'


export const expressX = expressX_
export const isAuthenticated = isAuthenticated_
export const isNotExpired = isNotExpired_
export const extendExpiration = extendExpiration_
export const protect = protect_
