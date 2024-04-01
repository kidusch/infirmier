
// socket.io connection data and pub/sub rooms are preserved on network disconnections/reconnections, but not on page refresh / reload
// (when a new page is loaded or the current page is refreshed, all resources from the previous page are closed and freed by the browser, including websockets)
// We want connection data and pub/sub rooms preserved after a page refresh / reload

export default async function(app) {

   const io = app.get('io')

   const roomCache = {}
   const dataCache = {}

   app.addDisconnectingListener((socket, reason) => {
      console.log('onSocketDisconnecting', socket.id, reason)
      // put disconnecting socket data & rooms in caches
      roomCache[socket.id] = new Set(socket.rooms)
      dataCache[socket.id] = Object.assign({}, socket.data)
})

   app.addConnectListener((socket) => {
      console.log('onSocketConnect', socket.id)
   
      // when client ask for transfer from fromSocketId to toSocketId
      socket.on('cnx-transfer', async (fromSocketId, toSocketId) => {
         app.log('verbose', `cnx-transfer from ${fromSocketId} to ${toSocketId}`)
         // copy connection room & data from 'fromSocketId' to 'toSocketId'
         const toSocket = io.sockets.sockets.get(toSocketId)
         // data & rooms of fromSocketId are taken from dataCache and roomCache, since socket no longer exists
         const fromSocketRooms = roomCache[fromSocketId]
         if (toSocket && fromSocketRooms) {
            // copy rooms
            for (const room of fromSocketRooms) {
               if (room === fromSocketId) continue // do not include room associated to socket#id
               toSocket.join(room)
            }
            // copy data
            toSocket.data = dataCache[fromSocketId]
            console.log('data', toSocket.data)
            console.log('rooms', toSocket.rooms)
            // remove 'from' cache data
            delete roomCache[fromSocketId]
            delete dataCache[fromSocketId]
         } else {
            console.log(`*** CNX TRANSFER ERROR, ${fromSocketId} -> ${toSocketId}`)
         }
      })
   })
}
