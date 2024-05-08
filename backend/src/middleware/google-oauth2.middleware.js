
import { AuthorizationCode } from 'simple-oauth2'
import axios from 'axios'
import config from '#config'

import { roomCache, dataCache } from '../transferData.mjs'


export default function (app) {

	const prisma = app.get('prisma')

	// Google OAuth2 configuration
	const googleConfig = {
		client: {
			id: process.env.GOOGLE_ID,
			secret: process.env.GOOGLE_SECRET,
		},
		auth: {
			tokenHost: 'https://accounts.google.com',
			tokenPath: '/o/oauth2/token',
			authorizePath: '/o/oauth2/auth'
		}
	}

	// Initialize OAuth2 client
	const oauth2 = new AuthorizationCode(googleConfig)


	// Redirect user to Google for authentication
	app.get('/auth/google', (req, res) => {
		console.log('query', req.query)
		const authorizationUri = oauth2.authorizeURL({
			redirect_uri: `${process.env.CLIENT_URL}/auth/google/callback`,
			scope: 'openid profile email',
			state: req.query.cnxid,
		})
		res.redirect(authorizationUri)
	})


	// Handle callback from Google authentication
	app.get('/auth/google/callback', async (req, res) => {
		const { code, state: cnxid } = req.query
		// console.log('cnxid', cnxid)
		const options = {
			code,
			redirect_uri: `${process.env.CLIENT_URL}/auth/google/callback`
		}
		try {
			const result = await oauth2.getToken(options)
			const { token } = oauth2.createToken(result)
			// Use token to retrieve user information from Google API
			console.log('token', token)
			const response = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
				headers: {
					Authorization: `Bearer ${token.token.access_token}`
				}
			})
			console.log('data', response.data)
			const { sub: google_id, name, picture, email } = response.data
			let isUserCreated = false
			let user = await prisma.user.findUnique({ where: { google_id } })
			if (user) {
				console.log('existing user', user)
			} else {
				isUserCreated = true
				user = await prisma.user.create({
					data: {
						google_id,
						name,
						email,
						picture,
					}
				})
				console.log('new user', user)
			}

			// cnxid has been diconnected during Google auth and its data & rooms were saved in dataCache & roomCache under the key `cnxid`
			// Directly modify dataCache & roomCache of cnxid so that information will be transfered on reconnection
			// set data.user
			console.log('cnxid', cnxid)
			console.log('dataCache', dataCache)

			if (!dataCache[cnxid]) {
				console.log('EXISTE PAS')
				dataCache[cnxid] = {}
			}
			if (!roomCache[cnxid]) {
				console.log('EXISTE PAS')
				roomCache[cnxid] = new Set()
			}
			dataCache[cnxid].user = user
			// set data.expiresAt
			dataCache[cnxid].expiresAt = new Date((new Date()).getTime() + config.SESSION_EXPIRE_DELAY)
			// add connection to channel 'authenticated'
			roomCache[cnxid].add('authenticated')

			// add 'login' user action
			await prisma.user_action.create({
				data: {
					user_id: user.id,
					action: 'login',
				}
			})
			
			// redirect; this will lead to a connection transfer from cnxid
			if (isUserCreated) {
				res.redirect(`/google-signup-confirm/${user.id}`)
			} else {
				res.redirect(`/home/${user.id}`)
				// if (user.admin) {
				// 	res.redirect(`/home/${user.id}/admin-ue`)
				// } else {
				// 	res.redirect(`/home/${user.id}/study-ue`)
				// }	
			}
		} catch (error) {
			console.error('Access Token Error', error.message)
			res.status(500).json('Authentication failed')
		}
	})

}
