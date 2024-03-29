
import passportMiddleware from './passport.middleware.js'


export default function (app) {

   app.configure(passportMiddleware)

}
