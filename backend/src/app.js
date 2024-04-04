import express from 'express'
// import { expressX } from '@jcbuisson/express-x'
import { expressX } from './server.mjs'
import { PrismaClient } from '@prisma/client'
import config from 'config'

import logging from './logging/index.js'
import services from './services/index.js'
import channels from './channels.js'
import appHooks from './app-hooks.js'
import transfer from './transfer.js'
import middleware from './middleware/index.js'

// `app` is a regular express application, enhanced with express-x features
const app = expressX(config)

console.log('DATABASE_URL', config.DATABASE_URL)
process.env['DATABASE_URL'] = config.DATABASE_URL
const prisma = new PrismaClient()
app.set('prisma', prisma)

// logging
app.configure(logging)

// services
app.configure(services)

// application hooks
app.hooks(appHooks)

// middleware
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.configure(middleware)

// development only: serve static assets (reports, avatars)
app.use('/static', express.static('./static'))

// pub/sub
app.configure(channels)

// cnx transfer
app.configure(transfer)


// throw an error for a client service method call when socket.data.expiresAt is missing or overdue
const isNotExpired = async (context) => {
   // do nothing if its not a client call from a ws connexion
   if (!context.socket) return
   const expiresAt = context.socket.data.expiresAt
   if (expiresAt) {
      const expiresAtDate = new Date(expiresAt)
      const now = new Date()
      if (now > expiresAtDate) {
         // expiration date is met: clear socket.data & throw exception
         context.socket.data = {}
         throw new Error('session-expired')
      }
   } else {
      throw new Error('session-expired')
   }
}

// throw an error for a client service method call when socket.data does not contain user
const isAuthenticated = async (context) => {
   // do nothing if its not a client call from a ws connexion
   if (!context.socket) return
   if (!context.socket.data.user) throw new Error('not-authenticated')
}

app.createService('caca', {
   chie: () => console.log('chie')
})
app.service('caca').hooks({
   before: {
      chie: [isAuthenticated, isNotExpired],
   }
})

export default app
