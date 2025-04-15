
# Bugs

- avec un réseau lent, le préchargement ne se finit pas, et l'appli redémarre lorsque on commence à l'utiliser






!!!! IL FAUT BUILDER LE PROJET JS POUR QU'IL FONCTIONNE SUR IOS & ANDROID !!!!
UTILISER `npm run build:ios` et `npm run uild:android`




# Modes d'utilisation

- 'free' : accès gratuit à l'application, mais seuls quelques cours marqués 'free' et les éléments associés sont accessibles
- 'standard' : un abonnement de premier niveau permet d'avoir accès à tous les éléments
- 'premium' : un abonnement de deuxième niveau permet d'avoir en plus la correction personnalisée, etc.


# Choix techniques

## CapacitorJS pour les versions mobiles
Génère les projets iOS et Android
Essai de PWABuilder (Microsoft) Pb : rien prévu pour in-app purchase

## Authentification Google
- Initialement l'authentification Google était implémentée avec le flow recommandé (Authorization Code Grant)
(voir google-auth2.middleware.js), mais je n'ai pas réussi à l'adapter à iOS et Android.
Finalement j'ai créé jcb-capacitor-googleauth basé sur Google OAuth Capacitor plugin : https://github.com/CodetrixStudio/CapacitorGoogleAuth
qui utilise le flow 'Implicit Flow' normalement déconseillé, qui ne nécessite pas de secret, seulement un clientId,
et ne fait aucune interaction avec le backend.
Renvoie directement le user Google, qu'il faut ensuite lier au user de l'application.
Fonctionne sur iOS (et Android), mais aussi pour le web.

- utiliser Google Developer Console pour créer les identifiants web/ios/android :
https://console.cloud.google.com/apis/dashboard?project=infirmier-418706

.env définit VITE_GOOGLE_APP_CLIENT_ID = clientId de "Client Web 1"
.env.ios définit VITE_GOOGLE_APP_CLIENT_ID = clientId de "Client iOS 1"
.env.android définit VITE_GOOGLE_APP_CLIENT_ID = clientId de "Client Android 1"


## Abonnements
- Abonnements 'inapp' sur iOS et Android, abonnements Stripe sur le web
- Développement d'un plugin Capacitor 'jcb-capacitor-inapp' accessible sur npm (le plugin Cordova 'cordova-plugin-purchase' est vieux et non fonctionnel)
pour iOS et Android


# Configurations

- Google Developer Console pour l'authentification
- Apple Developer pour les certificats: https://developer.apple.com/
- Appstore Connect pour la création de l'application et ses abonnements et le suivi de TestFlight, des achats etc. https://appstoreconnect.apple.com

- frontend, voir : https://vitejs.dev/guide/env-and-mode, accessibles via import.meta.env
   - .env              pour version web / PWA
   - .env.iosdev       pour exécution sur iOS avec le backend de dev
   - .env.ios          pour exécution sur iOS avec le backend de prod
   - .env.androiddev   pour exécution sur Android avec le backend de dev
   - .env.android      pour exécution sur Android avec le backend de prod

Lancer le backend en dev :
```
cd backend
npm run dev
```

# Version web

## Achat abonnements : Stripe

- les modes 'test' et 'live' sont indépendants, chacun a ses clés d'api et ses codes produits
- accès aux clés d'api : sur la page d'accueil du dashboard Stripe, sur la droite
- utiliser le dashboard Stripe pour créer les 4 types d'abonnements ("Catalogue de produits") : https://dashboard.stripe.com/login
(voir README.secret pour les identifiants et utiliser Google Authenticator avec l'adresse admin@journaldebordide.com)
- reporter les codes des 'produits' correspondants dans frontend/.env
- doc : https://docs.stripe.com/
- carte de test : 4242 4242 4242 4242, expiration 09/28, CVC: 123

Pour qu'un utilisateur s'abonne, il faut lui créer un customer id s'il n'en a pas déjà un (voir stripe_customer_id dans le schéma Prisma),
puis créer un paiement récurrent lors de la prise de l'abonnement

--> pour faire un formulaire de paiement plus joli et plus complet, peut-être essayer https://docs.stripe.com/payments/payment-element


# VERSION IOS

App enregistrée sur le compte de Charlène (voir README.secret)
Bundle id : com.journaldebordide.app
Identifiant Apple : 6673904628
Apple Id prefix : T8P24LJSUB (Team ID)
UGS : infirmier

## Build
```
cd frontend
npm run build:iosdev   # vite build --mode iosdev && npx cap sync)
ou : npm run build:ios
npx cap open ios
```
Exécution en dev sur XCode : cocher "automatic signing"
Choisir la team : "CHARLENE FANTONE"
On peut exécuter sur simulateur ou sur device

À TESTER :
Project / App / deployment target : 15.0
Target / App / minimal deployment target : 15.0
Project format (barre droite) : XCode 15


## Authentification Google
- Google Developer Console : https://console.cloud.google.com
- utilise un "Client ID for iOS" (voir Google Developers Console, "Client iOS 1")
- ajouter à Info.plist, "URL Types", identifier: REVERSED_CLIENT_ID, URL schemes: com.googleusercontent.apps.35236017874-2mus35pvufa8kfbojf5p7u1f0cmts4qa
(Xcode: App - Targets/App - Info - URL Types, click '+')
- marche en dev avec le simulateur

ios & android : ajouter à capacitor.config.json :
   "clientId": "35236017874-cdtgpjkhkpkrrp6f6p4l5ku60e6ipmv6.apps.googleusercontent.com"
METTRE LE WEB CLIENT ID

## Certificats de développement et de distribution, provisioning profiles
- les créer sur Apple Developer, compte Charlène, types "iOS development" et "iOS distribution" (voir README.secret)
- il n'était peut-être pas nécessaire d'avoir un compte moi-même
- les télécharger et double-cliquer pour qu'ils s'installent dans le trousseau "session"
- créer des "provisioning profiles" de développement et de distribution
- les télécharger et double-cliquer pour qu'ils s'installent dans XCode
- à la demande d'un mot de passe pour les cerificats, entrer le mdp de "session" (= M**e) et cliquer sur "Toujours autoriser"

## TestFlight & distribution
- builder l'appli en mode production : npm run build:ios
- choisir le provisioning profile de prod et faire "Archive"
- uploader le build sur AppStore Connect (cliquer sur "Distribute App", puis "TestFlight & AppStore" ou "TestFlight interne", se connecter à AppStore Connect d'abord ? et redémarrer XCode ?)
- dans AppStore Connect, repérer le build, compléter l'info manquante, lui ajouter un groupe de testeurs
- sur l'iPhone, installer l'application "TestFlight" : les builds seront accessibles si on fait partie de l'équipe de test

## inApp purchase des abonnements
iOS : >iOS15 (utilise StoreKit2, les transactions, async/await)
Voir : https://medium.com/@aisultanios/implement-inn-app-subscriptions-using-swift-and-storekit2-serverless-and-share-active-purchases-7d50f9ecdc09
Voir : https://developer.apple.com/documentation/storekit/in-app_purchase
AppStore Connect (https://appstoreconnect.apple.com)

Test, voir https://developer.apple.com/videos/play/wwdc2023/10142
- dans AppStore Connect, définir les 4 abonnements avec leur nom, description, prix, périodicité
- test en simulation totalement offline, sans utiliser AppStore Connect, en utilisant un 'StoreKit configuration file' :
-> le créer dans XCode avec File -> new -> File -> StoreKit Configuration
Le fichier est ensuite visible dans la vue 'fichiers' de XCode
-> l'utiliser dans le Run avec Product -> Scheme -> Edit Scheme... -> choisir le fichier dans la rubrique "StoreKit configuration"
Gestion des abonnements depuis XCode : Debug -> StoreKit. On voit les expirations / renouvellements se dérouler en temps réel (accéléré
au rythme défini dans le 'StoreKit configuration file')
- test des inapps marche pas en exécution directe avec un device
- test des inapps marche avec TestFlight, et les achats sont fictifs
- test avec Sandbox ? Pas réussi

## Compte "Sandbox" pour les tests d'inapp purchase
- voir : https://developer.apple.com/documentation/storekit/in-app_purchase/testing_in-app_purchases_with_sandbox
- création d'un compte Sandbox (AppstoreConnect / Utilisateurs et accès / Sandbox) : jean-christophe.buisson@n7.fr / apM**e
- builder l'application avec iosdev ou ios
- exécuter depuis XCode en mode DÉVELOPPEMENT sur un device (ou en simulation ?)
- aller dans AppStore, cliquer en haut à droite et se déconnecter (tout en bas du menu); répondre que "vous n'êtes pas XXX" à la question
relative au compte iCloud
- se connecter (à l'AppStore) avec les identifiants Sandbox
- lancer l'exécution depuis XCode, acheter des abonnements
- les abonnements achetés devraient se voir, non pas dans l'AppStore, mais dans la partie réglages/iCloud (rubrique "abonnements"),
l'email de sandbox est affiché.
Mais même après un achat d'abonnement (en test) réussi, l'abonnement n'y figure pas. Il ne figure pas non plus dans AppStore Connect
Peut-être que ça marche pour les produits, mais pas pour les abonnements ?



# VERSION ANDROID

A tout moment une version installée sur une tablette connectée en USB peut être débuggée avec AndroidStudio,
en sélectionnant la tablette dans la barre du haut, et les logs en forme de chat en bas à gauche. Filtrer avec "Capacitor".

## Test en développement
Exécuter `npm run build:androiddev` pour mettre à jour le projet. Voir .env.androiddev
On peut directement tester en simulation depuis Android Studio, ou sur un device simplement en le branchant et en le sélectionnant dans la barre du haut.

## Logs
Pour voir les logs, c'est l'icone en forme de chat dans la barre vertical en bas à gauche. Filtrer les lignes "Capacitor"

## Numéro de version
Dans build.gradle (:app)

## Construction des App Bundle
"App bundles" = archive contenant le code compilé + fichiers de configuration. Obligatoire maintenant à la place des fichiers .apk
C'est Google Play qui construit les .apk en fonction du device et du contexte

Suivre exactement les instructions (complexes) de https://developer.android.com/studio/publish/app-signing?hl=fr

Ces "App  bundle" doivent être signés avant d'être uploadés sur Google Play Console.
Les clés sont situées dans un 'keystore': frontend/android-keystore/keystore.jks, mdp : M**e
Clé d'importation 'upload' dans ce keystore pour l'importation des "App Bundle", mdp M**e

- dans build.gradle, changer les numéros, par ex : versionCode 52  versionName "0.9.52"
- Build du App Bundle : Build -> Generate Signed Bundle/APK
CHOISIR "BUILD VARIANT" RELEASE
App Bundle (.aab) créé dans frontend/android/app/release

## Upload du build dans Google Play Console : Explorateur d'App Bundle
https://play.google.com/console/u/1/developers/?%3Bhl=fr&hl=fr
Choisir l'application -> "Publier" (colonne gauche) -> "Explorateur d'app Bundle" -> "Importer une nouvelle version" (en haut à droite, peu visible)

Les App Bundle seront alors dans une "bibliothèque". Pour les tests internes, fermés, ouverts, distribution, on pourra prendre
les différentes versions dans cette bibliothèque

## Tests internes
- dans Google Play Console, sélectionner l'application, puis aller dans "Publier" -> "Tests" -> "Tests internes"
- dans l'onglet 'version', cliquer sur 'Créer une version' ; importer l'AppBundle depuis la bibliothèque ou un fichier
- dans l'onglet 'testeurs' cocher la liste des testeurs ; en bas de la page il y a le lien de test

## Tests fermés
NÉCESSAIRE DE LES FAIRES AVEC 20+ TESTEURS POUR POUVOIR SOUMETTRE À PUBLICATION !
Voir : https://support.google.com/googleplay/android-developer/answer/14151465

## Partage pour tests (?)
https://play.google.com/console/u/0/internal-app-sharing?hl=fr

## inApp purchase des abonnements
Voir : https://developer.android.com/google/play/billing
Depuis aout 2024, nouvelle version du billing system.
- définir dans Google Play Console les 4 abonnements avec leur nom, description, prix, périodicité
Leurs product id doivent être 'standard_monthly', 'standard_yearly', 'premium_monthly', 'premium_yearly'
- Ne marche pas en simulation, ne marche pas avec un device réel en exécution immédiate
- utiliser une release de test uploadée dans Google Play Console.
Attention, les achats sont réels, y a-t-il un moyen d'avoir des achats fictifs ?

- Ajouter dans build.gradle:
```
dependencies {
   ...
   def billing_version = "7.0.0"
   implementation "com.android.billingclient:billing:$billing_version"
}
```

- Ajouter dans AndroidManifest.xml:
```
   <uses-permission android:name="com.android.vending.BILLING" />
```
- Nécessaire d'ajouter un test de license dans Google Play Console : Paramètres -> Test de license
- on peut tester les inapp en dev avec exécution sur un device et avec un compte Google normal comme buisson.jc7@gmail.com


## Authentification Google


SocialLogin instructions: https://github.com/Cap-go/capacitor-social-login/blob/main/docs/setup_google.md#ios
- `cd android; ./gradlew singInReport`
- recopier SHA-1 dans la Google Console pour la configuration du client OAuth2 Android
- cliquer sur "Vérifier la propriété"






Difficile de tester avec le serveur de dev car le code Android considère que localhost ou 127.0.0.1 est le device Android et non la machine locale
Le plus simple est de tester avec le serveur de production

Voir : https://medium.com/codetrixstudio/authenticate-using-google-sign-in-in-capacitor-706e28703e69
Voir : https://enappd.com/blog/google-login-in-ionic-capacitor-app-with-angular/178/

- utilise un "Client id for Android", voir Google Cloud Console : https://console.cloud.google.com
- SHA fingerprint : exécuter `keytool -keystore frontend/android-keystore/keystore.jks -list -v` (mdp: M**e) et copier le SHA-1
dans le champ 'Empreinte numérique du certificat SHA-1' de la configuration du client android
(OU : keytool -list -v \
  -keystore ~/.android/debug.keystore \
  -alias androiddebugkey \
  -storepass android \
  -keypass android
) ??
`keytool -keystore android-keystore/keystore.jks -list -v` -> SHA-1 = 1E:18:0A:96:11:5D:64:81:9B:B3:9D:80:B9:73:61:B1:22:D4:4F:69

(? - dans src/main/res/strings.xml, ajouter <string name="server_client_id">35236017874-cdtgpjkhkpkrrp6f6p4l5ku60e6ipmv6.apps.googleusercontent.com</string> )

- dans android/app/src/main/AndroidManifest.xml, modifier la ligne du début :
```
<manifest xmlns:android="http://schemas.android.com/apk/res/android" package="com.journaldebordide.app">
```

(- modifier android/variables.gradle et passer minSdkVersion à 24

- pour que ça marche en dev, il faut autoriser le non-https :
   - ajouter à android/app/src/main/AndroidManifest.xml :
```
<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android">
   <application

      android:usesCleartextTraffic="true"
      android:networkSecurityConfig="@xml/network_security_config"
      ...
```
- créer un fichier android/app/src/main/res/xml/network_security_config.xml :
```
<?xml version="1.0" encoding="utf-8"?>
<network-security-config>
    <domain-config cleartextTrafficPermitted="true">
        <domain includeSubdomains="true">localhost</domain>
        <domain includeSubdomains="true">infirmier.jcbuisson.dev</domain>
    </domain-config>
</network-security-config>
```
)


# Génération des icons / splash screens pour la distribution dans les stores

Utilisation de capacitor-assets. Il cherche dans ./assets les fichiers logo.png et splash.png
```
npx capacitor-assets generate --ios
npx capacitor-assets generate --android
npx capacitor-assets generate --pwa
```


# Pas de sessions

Ça complique inutilement ; sur les mobiles une session peut durer plusieurs jours.

Les événements sont datés et relatifs à l'utilisateur après authentification.
Les sessions pourront être déterminées après-coup en regroupant les événements.


# Indexedb

- Indexedb est utilisé pour le cache local au lieu de LocalStorage, pour des raisons de taille
- vueuse/useIDBKeyval est utilisé pour gérer Indexedb de façon réactive; il est basé sur le package idb-keyval


# Routage

Après login local ou OAuth2, un accès à '/home/:userid' est effectué, qui conduit à stocker `:userid` dans sessionStorage sous la clé 'userid'.
Selon le type de l'utilisateur, il est redirigé vers '/student' ou '/admin'.
Dans leur `beforeEnter`, ces routes ajoutent la propriété 'userid' dont la valeur est prise dans sessionStorage.
Les url ne contiennent donc jamais l'identifiant de l'utilisateur et peuvent être utilisées comme liens dans les pages de cours par exemple


# Page de présentation

Essais avec vike.js sans succès.
Mis un proxypass vers express pour /presentation et mis une règle de routage app.get('/presentation') (voir presentation.middleware.js)
Produit une page HTML directement, ou en utilisant la fonction SSR `renderToString` de VueJS


# Parsing (abandonné)

PEGJS (projet cloné dans CLONES)
https://shamansir.github.io/pegjs-fn/
https://github.com/pegjs/pegjs

```
pegjs grammar.pegjs    # génère 'grammar.js'
```

(Alternative)
https://github.com/kach/nearley
https://omrelli.ug/nearley-playground/


# PWA

## PWA manifest
La doc est incomplète, notamment sur les icones.
Utilisé : https://stackoverflow.com/questions/62373216/vue-pwa-plugin-manifest-doesnt-use-my-config-attributes
Il faut éditer la section 'pwa' de vue.config.js
Lors du build, un fichier `manifest.json` sera généré dans dist/

## PWA, service workers
SW : https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API/Using_Service_Workers
VueJS cache busting : https://medium.com/js-dojo/vuejs-pwa-cache-busting-8d09edd22a31

## PWA web push
see: https://developers.google.com/web/ilt/pwa/introduction-to-push-notifications

- à chaque destinataire de notification correspond une 'subscription', qui représente une adresse d'envoi, sur un device donné
pour une application donnée. Si l'utilisateur se connecte à l'application avec N devices, les notifications
seront envoyées aux N subscriptions associées
Une subscription est créé côté client par la méthode getWebPushSubscription via le service worker / push manager
ATTENTION : cette méthode doit être appelée dans le handler d'un GESTE UTILISATEUR.
Dans l'application, on profite du bouton "Continuer" de WelcomeStudent.vue

iOS : après installation sur l'écran d'accueil (ou réinstallation), l'application n'apparait pas tout de suite dans la liste des applications.
À l'appui sur "Continuer", à la création de la première subscription, iOS demande à l'utilisateur s'il autorise les notifications.
Après acceptation et création de la première subscription, l'application apparait dans la liste.

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



## Références utiles

MSD manuals : https://www.msdmanuals.com
