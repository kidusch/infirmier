
export default async function(app) {

   app.addConnectListener((socket) => {
      socket.data.expireAt = 10000

   })

}
