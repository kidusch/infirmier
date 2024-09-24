
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
                        name: "Journal de Bord Infirmier",
                     },
                     recurring: {
                        interval: 'month',
                     },
                     unit_amount: 200, // Amount in cents = 2€
                  },
                  quantity: 1,
               },
            ],
            mode: 'subscription',
            // success_url: `${process.env.CLIENT_URL}/subscription-success/${userid}`,
            // cancel_url: `${process.env.CLIENT_URL}/subscription-failure/${userid}`,
            success_url: `${process.env.CLIENT_URL}/student/subscription-success`,
            cancel_url: `${process.env.CLIENT_URL}/student/subscription-failure`,
         })
         return session
      },

      createCustomer: async (paymentMethodId, customerEmail) => {
         try {
            const customer = await stripe.customers.create({
               payment_method: paymentMethodId,
               email: customerEmail,
               invoice_settings: {
                  default_payment_method: paymentMethodId,
               },
            })
            return customer.id
         } catch(err) {
            return ({
               error: err.message
            })
         }
      },

      createSubscription: async (customerId, priceId) => {
         try {
            // Create a Subscription
            const subscription = await stripe.subscriptions.create({
               customer: customerId,
               items: [{ price: priceId }],
               expand: ['latest_invoice.payment_intent'],
            })
         
            // Return the client secret for the payment
            const clientSecret = subscription.latest_invoice.payment_intent.client_secret
         
            return ({
               clientSecret,
               subscriptionId: subscription.id,
            })
         } catch(err) {
            return ({
               error: err.message
            })
         }
      },

      cancelSubscription: async (subscriptionId) => {
         try {
            const subscription = await stripe.subscriptions.del(subscriptionId)
            console.log('Subscription canceled:', subscription)
            return subscription
         } catch (error) {
            console.error('Error canceling subscription:', error)
            return ({
               error: error.message
            })
         }
      },

      subscriptionStatus: async () => {
         try {
            const data = await stripe.subscriptions.list()
            return data
         } catch (error) {
            console.error('Error canceling subscription:', error)
            return ({
               error: error.message
            })
         }
      },
   })
}
