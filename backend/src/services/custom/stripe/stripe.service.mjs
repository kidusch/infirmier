
import Stripe from 'stripe'


export default function(app) {

   const stripe = Stripe(process.env.STRIPE_INFIRMIER_SECRET_KEY)

   app.createService('stripe', {

      createSession: async (userid) => {
         const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
               {
                  price_data: {
                     currency: 'eur',
                     product_data: {
                        name: 'Abonnement mensuel à "Devenir Infirmier"',
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
            success_url: `${process.env.CLIENT_URL}/home/${userid}/subscription-success`,
            cancel_url: `${process.env.CLIENT_URL}/home/${userid}/subscription-failure`,
         })
         return session
      }
   })
}
