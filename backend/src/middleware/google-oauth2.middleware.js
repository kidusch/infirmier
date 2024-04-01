
import { AuthorizationCode } from 'simple-oauth2'
import axios from 'axios'


export default function (app) {

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
			redirect_uri: 'http://localhost:8000/auth/google/callback',
			scope: 'openid profile email',
			state: { a: 123 },
		})
		res.redirect(authorizationUri)
	})

	// Handle callback from Google authentication
	app.get('/auth/google/callback', async (req, res) => {
		const { code, state } = req.query
		const options = {
			code,
			redirect_uri: 'http://localhost:8000/auth/google/callback'
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
			// console.log('data', response.data)
			const { sub: google_id, name, given_name: firstname, family_name: lastname, picture, email } = response.data
			const prisma = app.get('prisma')
			let user = await prisma.user.findUnique({ where: { google_id } })
			if (user) {
				// console.log('existing user', user)
			} else {
				user = await prisma.user.create({
					data: {
						google_id,
						firstname,
						lastname,
						email,
						picture,
					}
				})
				// console.log('new user', user)
			}
			// only students use Google authentication
			res.redirect(`/student/${user.id}`)
		} catch (error) {
			console.error('Access Token Error', error.message)
			res.status(500).json('Authentication failed')
		}
	})

}
