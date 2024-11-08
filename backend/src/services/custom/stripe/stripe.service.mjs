
import Stripe from 'stripe'


export default function(app) {

   const stripe = Stripe(process.env.STRIPE_INFIRMIER_SECRET_KEY)

   app.createService('stripe', {

      createCustomer: async (paymentMethodId, customerEmail) => {
         console.log('createCustomer', paymentMethodId, customerEmail)
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

      cancelCustomerSubscriptions: async (customerId) => {
         console.log('cancelCustomerSubscriptions', customerId)
         try {
            const { data: subscriptions } = await stripe.subscriptions.list({
               customer: customerId,
               status: 'active',
            })
            for (const subscription of subscriptions) {
               const s = await stripe.subscriptions.cancel(subscription.id)
               console.log('canceled', s.id)
            }
            return { subscriptions }
         } catch (error) {
            console.error('Error canceling subscription:', error)
            return ({
               error: error.message
            })
         }
      },

      customerActiveSubscriptions: async (customerId) => {
         try {
            const { data: subscriptions } = await stripe.subscriptions.list({
               customer: customerId,
               status: 'active',
            })
            return subscriptions
         } catch (error) {
            console.error('Error subscriptionStatus:', error)
            return ({
               error: error.message
            })
         }
      },

      getPriceInfo: async (priceId) => {
         return await stripe.prices.retrieve(priceId)
      },

      getSubscriptionProductInfo: async (productId) => {
         return await stripe.products.retrieve(productId)
      },

      getStripePublicKey: async () => {
         return process.env.STRIPE_INFIRMIER_PUBLIC_KEY
      },

      getProductIdFromSubscriptionType: async (subscriptionType) => {
         if (subscriptionType === 'standard_monthly') return process.env.STRIPE_STANDARD_MONTHLY_SUBSCRIPTION_ID
         if (subscriptionType === 'standard_yearly') return process.env.STRIPE_STANDARD_YEARLY_SUBSCRIPTION_ID
         if (subscriptionType === 'premium_monthly') return process.env.STRIPE_PREMIUM_MONTHLY_SUBSCRIPTION_ID
         if (subscriptionType === 'premium_yearly') return process.env.STRIPE_PREMIUM_YEARLY_SUBSCRIPTION_ID
      },

      getSubscriptionTypeFromProductId: async (productId) => {
         if (productId === process.env.STRIPE_STANDARD_MONTHLY_SUBSCRIPTION_ID) return 'standard_monthly'
         if (productId === process.env.STRIPE_STANDARD_YEARLY_SUBSCRIPTION_ID) return 'standard_yearly'
         if (productId === process.env.STRIPE_PREMIUM_MONTHLY_SUBSCRIPTION_ID) return 'premium_monthly'
         if (productId === process.env.STRIPE_PREMIUM_YEARLY_SUBSCRIPTION_ID) return 'premium_yearly'
      },

   })
}
