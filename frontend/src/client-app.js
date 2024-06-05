import { io } from "socket.io-client"
import { useSessionStorage } from '@vueuse/core'

// import expressXClient from '@jcbuisson/express-x-client'
import expressXClient from './client.mjs'

import { appState } from '/src/use/useAppState'
// import { restartApp } from '/src/use/useAuthentication'


const socket = io({
   path: '/infirmier-socket-io/',
   transports: ["websocket"],
   reconnectionDelay: 1000,
   reconnectionDelayMax: 10000,
   extraHeaders: {
      "bearer-token": "mytoken"
   }
})

export const app = expressXClient(socket, { debug: true })

export const cnxid = useSessionStorage('cnxid', '')

app.onConnectError((socket, err) => {
   console.log('CNX ERROR!!!', socket.id, err.code)
})

app.onConnect(async (socket) => {
   const socketId = socket.id
   console.log('connect', socketId)
   // look for a previously stored connection id
   // const prevSocketId = getStorageSocketId()
   const prevSocketId = cnxid.value
   if (prevSocketId) {
      // it's a connection after a reload/refresh
      // ask server to transfer all data from connection `prevSocketId` to connection `socketId`
      console.log('cnx-transfer', prevSocketId, 'to', socketId)
      await socket.emit('cnx-transfer', prevSocketId, socketId)
      // update connection id
      // setStorageSocketId(socketId)
      cnxid.value = socketId

   } else {
      // set connection id
      // setStorageSocketId(socketId)
      cnxid.value = socketId
   }

   socket.on('cnx-transfer-ack', async (fromSocketId, toSocketId) => {
      console.log('ACK ACK!!!', fromSocketId, toSocketId)
   })

   socket.on('cnx-transfer-error', async (fromSocketId, toSocketId) => {
      console.log('ERR ERR!!!', fromSocketId, toSocketId)
      appState.value.unrecoverableError = true
   })

   socket.on('expired', async () => {
      console.log("server app-hook sent 'expired' event")
      appState.value.isExpired = true
   })
})
