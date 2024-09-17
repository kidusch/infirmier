
# Bugs

- premium doit passer à false lorsque le paiement/abonnement est interrompu


# Modes d'utilisation

- 'free' : accès gratuit à l'application, mais seuls quelques cours marqués 'free' et les éléments associés sont accessibles
- 'standard' : un abonnement de premier niveau permet d'avoir accès à tous les éléments
- 'premium' : un abonnement de deuxième niveau permet d'avoir en plus la correction personnalisée, etc.

Sur les stores, les abonnements sont des achats in-app, sur le web ce sont des abonnements Stripe


# Choix techniques pour application AppStore et GooglePlay

## CapacitorJS
Génère les projets iOS et Android
Voir détails plus loin par plateforme


## Authentification Google
https://github.com/CodetrixStudio/CapacitorGoogleAuth, plugin utilisé pour l'authentification Google
Voir détails plus loin par plateforme


## inApp purchase
Développement d'un plugin Capacitor 'jcb-capacitor-inapp' accessible sur npm (arrive pas à faire marcher le plugin Cordova 'cordova-plugin-purchase')

### iOS
iOS : >iOS15 (utilise StoreKit2, les transactions, async/await)

On peut tester en simulation sur iOS, en utilisant un 'StoreKit configuration file' (voir https://medium.com/@aisultanios/implement-inn-app-subscriptions-using-swift-and-storekit2-serverless-and-share-active-purchases-7d50f9ecdc09)
-> le créer dans XCode avec File -> new -> File -> StoreKit Configuration
-> l'utiliser dans le Run avec Product -> Scheme -> Edit Scheme... -> choisir le fichier dans la rubrique "StoreKit configuration"


## IOS
App enregistrée sur le compte de Charlène (voir README.secret)
PAS BESOIN D'AVOIR UN ABONNEMENT DÉVELOPPEUR ?
MOT DE PASSE TROUSSEAU SESSION IOS DEVELOPER CHARLENE FANTONE : VIDE

Bundle id : com.journaldebordide.app
Identifiant Apple : 6673904628
Apple Id prefix : T8P24LJSUB (Team ID)
UGS : infirmier

Sandbox tester (pour tests sur device) : Paul Maumy, jean-christophe.buisson@enseeiht.fr / apM**e


```
npm run build:ios   # vite build --mode ios && npx cap sync)
npm run build:android

npx cap open ios
npx cap open android
```

## Android




## Authentification Google

Voir [https://wiki.jcbuisson.dev/minimal/assets/images/auth-workflow.svg](schéma) : à adapter
suite au changement d'authentification Google

Initialement l'authentification Google était implémentée avec le flow recommandé (Authorization Code Grant)
(voir google-auth2.middleware.js), mais je n'ai pas réussi à l'adapter à iOS et Android.
Finalement on utilise Google OAuth Capacitor plugin : https://github.com/CodetrixStudio/CapacitorGoogleAuth,
qui utilise le flow 'Implcit Flow' normalement déconseillé, qui ne nécessite pas de secret, seulement un clientId,
et ne fait aucune intéraction avec le backend.
Renvoie directement le user Google, qu'il faut ensuite lier au user de l'application.
Fonctionne sur iOS et Android, mais aussi pour le web.

Google Developers Console : https://console.cloud.google.com/apis/dashboard?project=infirmier-418706

.env définit VITE_GOOGLE_APP_CLIENT_ID = clientId de "Client Web 1"
.env.ios définit VITE_GOOGLE_APP_CLIENT_ID = clientId de "Client iOS 1"
.env.android définit VITE_GOOGLE_APP_CLIENT_ID = clientId de "Client Android 1"


### iOS

- utilise un "Client ID for iOS" (voir Google Devlopers Console, "Client iOS 1")
- ajouter à Info.plist, "URL Types", identifier: REVERSED_CLIENT_ID, URL schemes: com.googleusercontent.apps.35236017874-2mus35pvufa8kfbojf5p7u1f0cmts4qa
(Xcode: App - Targets/App - Info - URL Types, click '+')

### Android
COMPLETER


## inAPP purchase

iOS : https://medium.com/@aisultanios/implement-inn-app-subscriptions-using-swift-and-storekit2-serverless-and-share-active-purchases-7d50f9ecdc09


## Pas de sessions

Ça complique inutilement ; sur les mobiles une session peut durer plusieurs jours.

Les événements sont datés et relatifs à l'utilisateur après authentification.
Les sessions pourront être déterminées après-coup en regroupant les événements.


## Indexedb

- Indexedb est utilisé pour le cache local au lieu de LocalStorage, pour des raisons de taille
- vueuse/useIDBKeyval est utilisé pour gérer Indexedb de façon réactive; il est basé sur le package idb-keyval


## Routage

Après login local ou OAuth2, un accès à '/home/:userid' est effectué, qui conduit à stocker `:userid` dans sessionStorage sous la clé 'userid'.
Selon le type de l'utilisateur, il est redirigé vers '/student' ou '/admin'.
Dans leur `beforeEnter`, ces routes ajoutent la propriété 'userid' dont la valeur est prise dans sessionStorage.
Les url ne contiennent donc jamais l'identifiant de l'utilisateur et peuvent être utilisées comme liens dans les pages de cours par exemple


## Page de présentation

Essais avec vike.js sans succès.
Mis un proxypass vers express pour /presentation et mis une règle de routage app.get('/presentation') (voir presentation.middleware.js)
Produit une page HTML directement, ou en utilisant la fonction SSR `renderToString` de VueJS


## Parsing (abandonné)

PEGJS (projet cloné dans CLONES)
https://shamansir.github.io/pegjs-fn/
https://github.com/pegjs/pegjs

```
pegjs grammar.pegjs    # génère 'grammar.js'
```

(Alternative)
https://github.com/kach/nearley
https://omrelli.ug/nearley-playground/



# PWA manifest
La doc est incomplète, notamment sur les icones.
Utilisé : https://stackoverflow.com/questions/62373216/vue-pwa-plugin-manifest-doesnt-use-my-config-attributes
Il faut éditer la section 'pwa' de vue.config.js
Lors du build, un fichier `manifest.json` sera généré dans dist/


# PWA, service workers
SW : https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API/Using_Service_Workers
VueJS cache busting : https://medium.com/js-dojo/vuejs-pwa-cache-busting-8d09edd22a31


# PWA web push
see: https://developers.google.com/web/ilt/pwa/introduction-to-push-notifications

- à chaque destinataire de notification correspond une 'subscription', qui représente une adresse d'envoi, sur un device donné
pour une application donnée. Si l'utilisateur se connecte à l'application avec N devices, les notifications
seront envoyées aux N subscriptions associées
Une subscription est créé côté client par la méthode getWebPushSubscription via le service worker / push manager
ATTENTION : cette méthode doit être appelée dans le handler d'un GESTE UTILISATEUR.
Dans l'application, on profite du bouton "Continuer" de WelcomeStudent.vue

iOS : après installation sur l'écran d'accueil (ou réinstallation), l'application n'apparait pas tout de suite dans la liste des applications.
À l'appui sur "Continuer", à la création de la première subscription, iOS demande à l'utilisateur s'il autorise les notifications.
Après accepttation et création de la première subscription, l'application apparait dans la liste.

- `app.service('notifications).addSubscription({userId, subscription})` permet au serveur de mémoriser une nouvelle
subscription pour un utilisateur.

- `app.service('notification').pushNotification(userId, data)` permet au serveur d'envoyer une notification à toutes
les subscriptions d'un client

- la librairie 'web-push' simplifie l'implémentation du protocole; le cryptage s'appuie sur des 'vapid-keys'.
Les mêmes 'vapid-keys' sont utilisées pour le serveur et pour tous les clients

Vapid keys (création : scrips/create-valid-keys.js)
Public Key: BCb26MnBWZp7X38igiSV-JZp4EIqRJ9NeiIGhjpFM_3Rs3y_6C08YNA7d1IVKR64uqmP0csnS7KmLVkn4bAiHuQ
Private Key: dh5acZXqHarphMNw6pDOgtgIG8fbxvC4qdprsnbkedg


# Anatomie 2D (abandonné)

A partir d'un fichier SVG chargé par l'admin, le contenu HTML/SVG est stocké dans la BD.
Les éléments 'path' du SVG qu'on souhaite mettre en valeur sont enrichis d'attributs 'data-rank' et 'data-name'.
Le innerHTML correspondant est stocké dans la BD et contient toute l'information nécessaire.

# Deep links (abandonné)

Abandonné pour ce projet, mais tests réussis sur iOS : https://capacitorjs.com/docs/guides/deep-links
Permet de lancer directement l'application en cliquant sur un lien web.
L'application doit être configurée pour connaitre le site web, et le site web doit connaitre l'appli ios
avec un fichier accessible à l'url /well-known/ 


# Modèles 3D

vue-3d-loader : https://github.com/king2088/vue-3d-loader/tree/master/src/examples

https://sketchfab.com/
https://www.mixamo.com


# SEO

- tentative d'utilisation de Vike pour prerendering de '/'
Semble prometteur et récent, mais délicat


# AppStore & Google Play

Essayer d'utiliser PWABuilder (Microsoft) Pb : rien prévu pour in-app purchase
Utiliser plutôt Capacitor (plugins pour in-app)


## Références utiles

MSD manuals : https://www.msdmanuals.com
