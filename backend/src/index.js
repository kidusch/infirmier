import app from '#root/src/app.js'

const port = app.get('config').PORT
const logger = app.get('logger')

app.httpServer.listen(port, () => {
   logger.log('info', `App is listening at http://localhost:${port}`)
})
