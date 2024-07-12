
import Stripe from 'stripe'


export default function(app) {

   const stripe = Stripe(process.env.STRIPE_INFIRMIER_SECRET_KEY)

   app.createService('stripe', {

      createSession: async () => {
         const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
               {
                  price_data: {
                     currency: 'eur',
                     product_data: {
                        name: 'Abonnement mensuel',
                     },
                     recurring: {
                        interval: 'month',
                     },
                     unit_amount: 1000, // Amount in cents = 10€
                  },
                  quantity: 1,
               },
            ],
            mode: 'subscription',
            success_url: `${process.env.CLIENT_URL}/payment_success`,
            cancel_url: `${process.env.CLIENT_URL}/payment_cancel`,
         })
         return session
      }
   })
}
