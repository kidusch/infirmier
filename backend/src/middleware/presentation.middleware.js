
import { createSSRApp } from 'vue'
import { renderToString } from 'vue/server-renderer'


export default function (app) {


	app.get('/presentation', (req, res) => {
      res.send(`<a href='/student/messages'>Continuer</a>`)
   })

   
	app.get('/presentation-ssr', (req, res) => {

      const ssrApp = createSSRApp({
         data: () => ({ count: 1 }),
         template: `<a href='/presentation'>Continuer (SSR)</a>`
      })
     
      renderToString(ssrApp).then((html) => {
         res.send(`
         <!DOCTYPE html>
         <html>
           <head>
             <title>Présentation</title>
           </head>
           <body>
             <div id="app">${html}</div>
           </body>
         </html>
         `)
      })
   })



}
