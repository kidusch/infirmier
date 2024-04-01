
export default async function(app) {

   app.addConnectListener((socket) => {
      socket.data.expiresAt = 10000

   })

}
