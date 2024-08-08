import { precacheAndRoute, cleanupOutdatedCaches } from 'workbox-precaching'
declare let self: ServiceWorkerGlobalScope

// prompt for new content
self.addEventListener('message', (event) => {
   if (event.data && event.data.type === 'SKIP_WAITING')
     self.skipWaiting()
})

// cleanup outdated cached assets
cleanupOutdatedCaches()

// cache assets
precacheAndRoute(self.__WB_MANIFEST)


// every time a push notification is received
self.addEventListener('push', function(e) {
  console.log('sw push!')
  const payload = e?.data.json()
  console.log('payload', payload)
  const options = {
     body: payload.text,
     icon: "https://ftp.jcbuisson.dev/images/logo_infirmier.png",
     requireInteraction: true,
     vibrate: [100, 50, 100],
     // tag: payload.tag,
     // data: payload,
  }
  // display a local notification
  e.waitUntil(
    self.registration.showNotification(payload?.title || "TITRE", options)
  )
})

// every time the notification is clicked
// see: https://developers.google.com/web/ilt/pwa/introduction-to-push-notifications
// see: https://developer.mozilla.org/en-US/docs/Web/API/Clients
self.addEventListener('notificationclick', function(event) {
  console.log('On notification click: ', event.notification)
  // close notification
  event.notification.close()

  // const { tag, sessionId, patientId } = event.notification.data

  // if (tag === 'urgent' || tag === 'sollicited') {
  //    const url = (tag === 'urgent') ?
  //       // start visio session when urgent
  //       `/visio-session?sessionId=${sessionId}&patientId=${patientId}&publishAudio=true&publishVideo=true&stopWhenAllGone=false&localControls=true&remoteVideoControl=true&publisherAvatarUrl=-&subscriberAvatarUrl=-`
  //       // only start application when sollicited
  //       : '/'
  //    console.log('url', url)

  //    // look for an existing mitab client window (pwa window is one of them)
  //    event.waitUntil(self.clients.matchAll({
  //       type: "window"
  //    }).then(function(clientList) {
  //       if (clientList.length > 0) {
  //          // a mitab window has been found, navigate to `url` and give it the focus
  //          console.log('clientList', clientList)
  //          let referentClientWindow = clientList.find(client => client.url.startsWith(import.meta.env.VITE_APP_BASE_URL))
  //          referentClientWindow.navigate(url)
  //          referentClientWindow.focus()
  //       } else {
  //          // no mitab window was found, create one
  //          self.clients.openWindow(url).then(function(windowClient) {
  //             // Do something with your WindowClient
  //          })
  //       }
  //    }))

  // } else if (tag === 'battery') {
  // }

})
