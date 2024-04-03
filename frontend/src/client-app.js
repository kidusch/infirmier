import { io } from "socket.io-client"
// import expressXClient from '@jcbuisson/express-x-client'
import expressXClient from './client.mjs'


const socket = io({
   path: '/infirmier-socket-io/',
   transports: ["websocket"],
   reconnectionDelay: 1000,
   reconnectionDelayMax: 10000,
   extraHeaders: {
      "bearer-token": "mytoken"
   }
})

const app = expressXClient(socket, { debug: true })

// // triggers disconnection / reconnection
// setTimeout(() => {
//    if (socket.io.engine) {
//      // close the low-level connection and trigger a reconnection
//      socket.io.engine.close()
//    }
// }, 10000)


function _getStorageSocketId() {
   if (typeof sessionStorage !== 'undefined') return sessionStorage.getItem('expressx-cnx-id')
   return nodeCnxId
}

function _setStorageSocketId(id) {
   if (typeof sessionStorage !== 'undefined') {
      sessionStorage.setItem('expressx-cnx-id', id)
   } else {
      nodeCnxId = id
   }
}

app.onConnect(async (socket) => {
   const socketId = socket.id
   console.log('connect', socketId)
   // look for a previously stored connection id
   const prevSocketId = _getStorageSocketId()
   if (prevSocketId) {
      // it's a connection after a reload/refresh
      // ask server to transfer all data from connection `prevSocketId` to connection `socketId`
      console.log('cnx-transfer', prevSocketId, 'to', socketId)
      await socket.emit('cnx-transfer', prevSocketId, socketId)
      // update connection id
      _setStorageSocketId(socketId)

   } else {
      // it's a first load/connection: ask the server to create a database session record
      await socket.emit('start-session')
      // set connection id
      _setStorageSocketId(socketId)
   }

   socket.on('cnx-transfer-ack', () => {
      console.log('ACKACK!!!')
   })
})

app.on('expired', () => {
   alert('expired')
})


export default app
