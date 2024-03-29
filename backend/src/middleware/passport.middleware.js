import passport from 'passport'
import { Strategy as GoogleStrategy } from 'passport-google-oauth20'
import { Strategy as LocalStrategy } from 'passport-local'

export default function (app) {

	// Configure Google OAuth Strategy
	passport.use(new GoogleStrategy({
			clientID: '35236017874-d9clkiq7q6etao4dahpdjl95a82o1r7i.apps.googleusercontent.com',
			clientSecret: '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',
			callbackURL: 'http://localhost:9500/auth/google/callback'
		},
		async (accessToken, refreshToken, profile, done) => {
			try {
				let user = await prisma.user.findUnique({ where: { googleId: profile.id } });
				if (!user) {
					user = await prisma.user.create({
						data: {
							google_id: profile.id,
							display_name: profile.displayName,
							firstname: profile.given_name,
							lastname: profile.family_name,
							email: profile.emails[0].value
						}
					})
				}
				done(null, user)
			} catch (error) {
			}
		}
	))

	// Configure Local Strategy for email/password authentication
	passport.use(new LocalStrategy({ usernameField: 'email' },
		async (email, password, done) => {
			try {
				const user = await prisma.user.findUnique({ where: { email } })
				if (!user || user.password !== password) {
					return done(null, false, { message: 'Invalid email or password' })
				}
				return done(null, user)
			} catch (error) {
				return done(error)
			}
		}
	))

	// Serialize user to store in the session
	passport.serializeUser((user, done) => {
		done(null, user.id)
	})

	// Deserialize user from the session
	passport.deserializeUser(async (id, done) => {
		try {
			const user = await prisma.user.findUnique({ where: { id } })
			done(null, user)
		} catch (error) {
			done(error)
		}
	})

	// Initialize passport middleware
	app.use(passport.initialize())


	// Initiate Google OAuth login
	app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }))

	// Google OAuth callback route
	app.get('/auth/google/callback',
		passport.authenticate('google', { failureRedirect: '/' }),
		(req, res) => {
			res.redirect('/profile')
		})

	// Login route for email/password authentication
	app.post('/login',
		passport.authenticate('local', {
			successRedirect: '/profile',
			failureRedirect: '/',
			failureFlash: true
		}))

	// Logout route
	app.get('/logout', (req, res) => {
		req.logout()
		res.redirect('/')
	})

}
