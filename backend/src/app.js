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

import { isAuthenticated, isNotExpired } from '#root/src/common-hooks.mjs'


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



app.createService('caca', {
   chie: () => console.log('chie')
})
app.service('caca').hooks({
   before: {
      chie: [isAuthenticated, isNotExpired],
   }
})

export default app
