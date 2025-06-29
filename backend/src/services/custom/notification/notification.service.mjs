import webpush from 'web-push'


webpush.setVapidDetails(
   'mailto:myuserid@email.com',
   process.env.vapidPublicKey,
   process.env.vapidPrivateKey
)


export default function (app) {

   const prisma = app.get('prisma')
   const logger = app.get('logger')
   
   app.createService('notification', {

      // add a new subscription (= notification recipient address) for `userId`, or update an existing one
      addSubscription: async (userId, subscription) => {
         // get user's subscription list
         const user = await prisma.user.findUnique({ where: { id: userId }})
         console.log('user', user)
         const subscriptionList = JSON.parse(user.subscription_list)
         console.log('subscriptionList', subscriptionList)
         // look for an existing substription with the same endpoint as `subscription`
         const existingSubscription = subscriptionList.find(s => s.endpoint == subscription.endpoint)
         if (existingSubscription) {
            // update existing subscription
            Object.assign(existingSubscription, subscription)
         } else {
            // add new subscription
            subscriptionList.push(subscription)
         }
         console.log('subscriptionList apres', subscriptionList)
         const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: { subscription_list: JSON.stringify(subscriptionList) }
         })
         console.log('updatedUser', updatedUser)
      },

      // remove all subscriptions with the same endpoint as `subscription`
      deleteSubscription: async (userId, subscription) => {
         // get user's subscription list
         const user = await prisma.user.findUnique({ where: { id: userId }})
         const subscriptionList = JSON.parse(user.subscription_list).filter(s => s.endpoint !== subscription.endpoint)
         prisma.user.update({
            where: { id: userId },
            data: { subscription_list: JSON.stringify(subscriptionList) }
         })
      },

      // send a notification to all devices connected with `userId`
      pushNotification: async (userId, payload) => {
         const user = await prisma.user.findUnique({ where: { id: userId }})
         const subscriptionList = JSON.parse(user.subscription_list)
         for (const subscription of subscriptionList) {
            await webpush.sendNotification(subscription, JSON.stringify(payload))
         }
      },

   })
}
