
import googleOAuth2Middleware from './google-oauth2.middleware.js'
import presentationMiddleware from './presentation.middleware.js'


export default function (app) {

   app.configure(googleOAuth2Middleware)
   app.configure(presentationMiddleware)

}
