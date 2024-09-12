
// import googleOAuth2Middleware from './google-oauth2.middleware.js'
import presentationMiddleware from './presentation.middleware.js'


export default function (app) {

   // has been replaced by CapacitorGoogleAuth plugin
   // app.configure(googleOAuth2Middleware)

   // test of SSR presentation page
   app.configure(presentationMiddleware)

}
