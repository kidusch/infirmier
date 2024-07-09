import webpush from 'web-push'


webpush.setVapidDetails(
   'mailto:myuserid@email.com',
   process.env.vapidPublicKey,
   process.env.vapidPrivateKey
)


export default function (app) {

   app.createService('notification', {

      // add a new subscription (= notification recipient address) for `userId`, or update an existing one
      addSubscription: async (userId, subscription) => {
         // get user's subscription list
         const user = await app.service('user').findUnique({ where: { id: userId }})
         const subscriptionList = JSON.parse(user.subscription_list)
         // look for an existing substription with the same endpoint as `subscription`
         const existingSubscription = subscriptionList.find(s => s.endpoint == subscription.endpoint)
         if (existingSubscription) {
            // update existing subscription
            Object.assign(existingSubscription, subscription)
         } else {
            // add new subscription
            subscriptionList.push(subscription)
         }
         app.service('user').update({
            where: { id: userId },
            data: { subscription_list: JSON.stringify(subscriptionList) }
         })
      },

      // remove all subscriptions with the same endpoint as `subscription`
      deleteSubscription: async (userId, subscription) => {
         // get user's subscription list
         const user = await app.service('user').findUnique({ where: { id: userId }})
         const subscriptionList = JSON.parse(user.subscription_list).filter(s => s.endpoint !== subscription.endpoint)
         app.service('user').update({
            where: { id: userId },
            data: { subscription_list: JSON.stringify(subscriptionList) }
         })
      },

      // send a notification to all devices connected with `userId`
      pushNotification: async (userId, payload) => {
         const user = await app.service('user').findUnique({ where: { id: userId }})
         if (!user) return
         const subscriptionList = JSON.parse(user.subscription_list)
         subscriptionList.forEach(subscription => {
            webpush.sendNotification(subscription, JSON.stringify(payload))
         })
      },

   })
}
