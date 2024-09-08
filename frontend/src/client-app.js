// COMMON TO NUTRIEDUC & INFIRMIER
// TO ADAPT: SOCKET PATH

import { io } from "socket.io-client"
import { useSessionStorage } from '@vueuse/core'

// import expressXClient from '@jcbuisson/express-x-client'
import expressXClient from './client.mjs'

import { appState } from '/src/use/useAppState'


const socket = io('https://infirmier.jcbuisson.dev', {
   // path: '/nutrieduc-socket-io/',
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
   // handle reconnections & reloads
   // look for a previously stored connection id
   const prevSocketId = cnxid.value
   if (prevSocketId) {
      // it's a connection after a reload/refresh
      // ask server to transfer all data from connection `prevSocketId` to connection `socketId`
      console.log('cnx-transfer', prevSocketId, 'to', socketId)
      await socket.emit('cnx-transfer', prevSocketId, socketId)
      // update connection id
      cnxid.value = socketId

   } else {
      // set connection id
      cnxid.value = socketId
   }

   socket.on('cnx-transfer-ack', async (fromSocketId, toSocketId) => {
      console.log('ACK ACK!!!', fromSocketId, toSocketId)
   })

   socket.on('cnx-transfer-error', async (fromSocketId, toSocketId) => {
      console.log('ERR ERR!!!', fromSocketId, toSocketId)
      appState.value.unrecoverableError = true
   })

   socket.on('not-authenticated', async () => {
      console.log("server app-hook sent 'not-authenticated' event")
      appState.value.isNotAuthenticated = true
   })
})
