IMPORTANT
!!!! IL FAUT BUILDER LE PROJET JS POUR QU'IL FONCTIONNE SUR IOS & ANDROID !!!! UTILISER npm run build:ios et npm run build:android (ou iosdev)

Bugs
avec un réseau lent, le préchargement ne se finit pas, et l'appli redémarre lorsque on commence à l'utiliser
Modes d'utilisation
'free' : accès gratuit à l'application, mais seuls quelques cours marqués 'free' et les éléments associés sont accessibles
'standard' : un abonnement de premier niveau permet d'avoir accès à tous les éléments
'premium' : un abonnement de deuxième niveau permet d'avoir en plus la correction personnalisée, etc.
Choix techniques
CapacitorJS pour les versions mobiles
Génère les projets iOS et Android Essai de PWABuilder (Microsoft) Pb : rien prévu pour in-app purchase

Abonnements
Abonnements 'inapp' sur iOS et Android, abonnements Stripe sur le web
Développement d'un plugin Capacitor 'jcb-capacitor-inapp' pour iOS et Android accessible sur npm (le plugin Cordova 'cordova-plugin-purchase' est vieux et non fonctionnel)
Authentification Google
Initialement l'authentification Google était implémentée avec le flow recommandé (Authorization Code Grant) (voir google-auth2.middleware.js), mais je n'ai pas réussi à l'adapter à iOS et Android. J'ai ensuite utilisé Google OAuth Capacitor plugin : https://github.com/CodetrixStudio/CapacitorGoogleAuth qui utilise le flow 'Implicit Flow' normalement déconseillé, qui ne nécessite pas de secret, seulement un clientId, et ne fait aucune interaction avec le backend. Il marche bien pour le web, pour iOS, mais impossible de le faire marcher pour Android. Finalement j'utilise @capgo/capacitor-social-login qui est le successeur de CodetrixStudio/CapacitorGoogleAuth, qui marche bien pour iOS et Android. Impossible de le faire marcher pour le web. Pour le web, j'utilise en plus jcb-capacitor-googleauth, fork de https://github.com/CodetrixStudio/CapacitorGoogleAuth

SocialLogin instructions: https://github.com/Cap-go/capacitor-social-login/blob/main/docs/setup_google.md

Configuration générale
utiliser Google Developer Console pour créer le projet : https://console.cloud.google.com/apis/dashboard?project=infirmier-418706
Google Developer Console / Audience : peu importe que le type d'utilisateur soit interne ou externe
Google Developer Console / Accès aux données : ajouter les 3 premiers champs d'application (email, profile, openid)
a-priori pas besoin de faire valider l'application
npm install @capgo/capacitor-social-login; npm install jcb-capacitor-googleauth; npx cap sync
Web
utilisation de jcb-capacitor-googleauth car arrive pas à faire marcher capacitor-social-login
Google Developer Console / Clients : créer un client pour web "Client Web 1"
iOS
https://github.com/Cap-go/capacitor-social-login/blob/main/docs/setup_google.md#ios
Google Developer Console / Clients : créer un client pour iOS "Client iOS 1"
XCode : App - Targets/App, Info, clic droit : "open as... source code". Ajouter à la fin : CFBundleURLTypes CFBundleURLSchemes com.googleusercontent.apps.35236017874-2mus35pvufa8kfbojf5p7u1f0cmts4qa
a-priori pas besoin de modifier AppDelegate
marche pas en dev, ni sur un device ni avec le simulateur
marche avec TestFlight
toujours re-builder pour tester : npm run build:ios
Android
https://github.com/Cap-go/capacitor-social-login/blob/main/docs/setup_google.md#android
android.defaultConfig.applicationId est déjà configuré par Capacitor
Google Developer Console / Clients : créer un client pour Android "Client Android 1"
exécuter cd android; ./gradlew signInReport et recopier SHA-1 dans "Client Android 1", champ "Empreinte numérique du certificat SHA1"
cliquer sur "Valider la propriété"
le client web 'Client Web 1' est nécessaire pour Android. Le client Android est également nécessaire, ainsi que la bonne valeur de SHA1
modifier 'MainActivity' (app/java/com.journaldebordide.app) :
package com.journaldebordide.app; import ee.forgr.capacitor.social.login.GoogleProvider; import ee.forgr.capacitor.social.login.SocialLoginPlugin; import ee.forgr.capacitor.social.login.ModifiedMainActivityForSocialLoginPlugin; import com.getcapacitor.PluginHandle; import com.getcapacitor.Plugin; import android.content.Intent; import android.util.Log; import com.getcapacitor.BridgeActivity;

// ModifiedMainActivityForSocialLoginPlugin is VERY VERY important !!!!!!
public class MainActivity extends BridgeActivity implements ModifiedMainActivityForSocialLoginPlugin {

  @Override
  public void onActivityResult(int requestCode, int resultCode, Intent data) {
    super.onActivityResult(requestCode, resultCode, data);

    if (requestCode >= GoogleProvider.REQUEST_AUTHORIZE_GOOGLE_MIN && requestCode < GoogleProvider.REQUEST_AUTHORIZE_GOOGLE_MAX) {
      PluginHandle pluginHandle = getBridge().getPlugin("SocialLogin");
      if (pluginHandle == null) {
        Log.i("Google Activity Result", "SocialLogin login handle is null");
        return;
      }
      Plugin plugin = pluginHandle.getInstance();
      if (!(plugin instanceof SocialLoginPlugin)) {
        Log.i("Google Activity Result", "SocialLogin plugin instance is not SocialLoginPlugin");
        return;
      }
      ((SocialLoginPlugin) plugin).handleGoogleLoginIntent(requestCode, data);
    }
  }

  // This function will never be called, leave it empty
  @Override
  public void IHaveModifiedTheMainActivityForTheUseWithSocialLoginPlugin() {}
}

Configurations
Apple Developer pour les certificats: https://developer.apple.com/

Appstore Connect pour la création de l'application et ses abonnements et le suivi de TestFlight, des achats etc. https://appstoreconnect.apple.com

frontend, voir : https://vitejs.dev/guide/env-and-mode, accessibles via import.meta.env

.env pour version web / PWA
.env.iosdev pour exécution sur iOS avec le backend de dev
.env.ios pour exécution sur iOS avec le backend de prod
.env.androiddev pour exécution sur Android avec le backend de dev
.env.android pour exécution sur Android avec le backend de prod
Lancer le backend en dev :

cd backend
npm run dev
VERSION WEB
Achat abonnements : Stripe
les modes 'test' et 'live' sont indépendants, chacun a ses clés d'api et ses codes produits
accès aux clés d'api : sur la page d'accueil du dashboard Stripe, sur la droite
utiliser le dashboard Stripe pour créer les 4 types d'abonnements ("Catalogue de produits") : https://dashboard.stripe.com/login (voir README.secret pour les identifiants et utiliser Google Authenticator avec l'adresse admin@journaldebordide.com)
reporter les codes des 'produits' correspondants dans frontend/.env
doc : https://docs.stripe.com/
carte de test : 4242 4242 4242 4242, expiration 09/28, CVC: 123
Pour qu'un utilisateur s'abonne, il faut lui créer un customer id s'il n'en a pas déjà un (voir stripe_customer_id dans le schéma Prisma), puis créer un paiement récurrent lors de la prise de l'abonnement

--> pour faire un formulaire de paiement plus joli et plus complet, peut-être essayer https://docs.stripe.com/payments/payment-element

VERSION IOS
App enregistrée sur le compte de Charlène (voir README.secret) Bundle id : com.journaldebordide.app Identifiant Apple : 6673904628 Apple Id prefix : T8P24LJSUB (Team ID) UGS : infirmier Project / App / deployment target : 15.0 Target / App / minimal deployment target : 15.0 n° version + n° build : Target / App / General / Identity

Checklist : déploiement d'une nouvelle version
npm run build:ios
npx cap open ios
...
Build et exécution en dev
cd frontend
npm run build:iosdev   # vite build --mode iosdev && npx cap sync ios)
exécution en dev sur XCode : cocher "automatic signing", choisir la team : "CHARLENE FANTONE". ? Il faut aussi changer un truc dans Project / Targets / App / Build settings / signing
on peut exécuter sur simulateur ou sur device
dans Project / Targets / App / onglet Release, cliquer sur '+ Capabilities' (en haut) et ajouter
'inApp Purchase' ?
"Push notifications", on ne s'en sert pas mais sinon ça provoque une erreur à la validation Apple
Certificats de développement et de distribution, provisioning profiles
les créer sur Apple Developer, compte Charlène, types "iOS development" et "iOS distribution" (voir README.secret)
il n'était peut-être pas nécessaire d'avoir un compte moi-même
les télécharger et double-cliquer pour qu'ils s'installent dans le trousseau "session"
créer des "provisioning profiles" de développement et de distribution
les télécharger et double-cliquer pour qu'ils s'installent dans XCode
à la demande d'un mot de passe pour les cerificats, entrer le mdp de "session" (= M**e) et cliquer sur "Toujours autoriser"
TestFlight & distribution
builder l'appli en mode production : npm run build:ios
dans Target / App / Signing & capabilities, choisir le provisioning profile de 'prov-distrib'
choisir "Any iOS device (arm64)" et faire "Product / Archive"
uploader le build sur AppStore Connect : "Distribute App", puis "TestFlight internal only",
dans AppStore Connect / TestFlight (se connecter avec buisson.jc7@gmail.com? ou charlene ?), repérer le build, compléter l'info manquante, lui ajouter un groupe de testeurs
sur l'iPhone, installer l'application "TestFlight" : les builds seront accessibles si on fait partie de l'équipe de test
Distribution
builder et archiver l'application comme pour TestFlight
uploader le build sur AppStore Connect : "Distribute App", puis "AppStore Connect"
dans AppStore Connect / Distribution, supprimer le build en cours, ajouter le nouveau, compléter l'info manquante, cliquer sur "Enregistrer"
dans le menu de gauche, cliquer sur "Vérification de l'app"
inApp purchase des abonnements
AppStore Connect (https://appstoreconnect.apple.com) (se connecter avec buisson.jc7@gmail.com et choisir Charlène Fantone ?)
choisir l'application, puis Distribution / Monétisation / Abonnements et définir le groupe 'abonnements' avec les 4 abonnements avec leur nom, description, prix, périodicité
'Abonnement standard mensuel' / 'standard_monthly', 1 month, renewable automatically
'Abonnement standard annuel' / 'standard_yearly', 1 year, renewable automatically
'Abonnement premium mensuel' / 'premium_monthly', 1 month, renewable automatically
'Abonnement premium annuel' / 'premium_yearly', 1 year, renewable automatically
Test offline (sans lien avec AppStore Connect) avec un 'StoreKit configuration file'
Voir https://developer.apple.com/videos/play/wwdc2023/10142 Test en simulation totalement offline, sans connexion à AppStore Connect, en utilisant un 'StoreKit configuration file' iOS : >iOS15 (utilise StoreKit2, les transactions, async/await) Voir : https://medium.com/@aisultanios/implement-inn-app-subscriptions-using-swift-and-storekit2-serverless-and-share-active-purchases-7d50f9ecdc09 Voir : https://developer.apple.com/documentation/storekit/in-app_purchase

créer un 'StoreKit configuration file' dans XCode avec File -> new -> File from template... -> StoreKit Configuration

cliquer sur 'synchronize with an Appstore Connect app' et choisir l'application

stocker le fichier n'importe où dans le projet, il est ensuite visible dans la vue 'fichiers' de XCode

l'utiliser dans le Run avec Product -> Scheme -> Edit Scheme... -> choisir le fichier dans la rubrique "StoreKit configuration" (ne marchait pas au début, puis s'est mis à marcher sans changement apparent)

gestion des abonnements depuis XCode : Debug -> StoreKit. On voit les expirations / renouvellements se dérouler en temps réel (accéléré au rythme défini dans le 'StoreKit configuration file')

npm run build:iosdev puis exécution depuis XCode sur un device ou le simulateur : fonctionne avec les inApp du StoreKit configuration file

test des inapps marche (plus ?) avec TestFlight, et les achats sont fictifs

test avec Sandbox ? Pas réussi

Compte "Sandbox" pour les tests d'inapp purchase end-to-end
voir https://developer.apple.com/videos/play/wwdc2023/10142
voir : https://developer.apple.com/documentation/storekit/in-app_purchase/testing_in-app_purchases_with_sandbox
création d'un compte Sandbox (AppstoreConnect / Utilisateurs et accès / Sandbox) : jean-christophe.buisson@n7.fr / apM**e
builder l'application avec iosdev ou ios
exécuter depuis XCode en mode DÉVELOPPEMENT sur un device (ou en simulation ?)
aller dans AppStore, cliquer en haut à droite et se déconnecter (tout en bas du menu); répondre que "vous n'êtes pas XXX" à la question relative au compte iCloud
se connecter (à l'AppStore) avec les identifiants Sandbox
lancer l'exécution depuis XCode, acheter des abonnements
les abonnements achetés devraient se voir, non pas dans l'AppStore, mais dans la partie réglages/iCloud (rubrique "abonnements"), l'email de sandbox est affiché. Mais même après un achat d'abonnement (en test) réussi, l'abonnement n'y figure pas. Il ne figure pas non plus dans AppStore Connect Peut-être que ça marche pour les produits, mais pas pour les abonnements ?
VERSION ANDROID
A tout moment une version installée sur une tablette connectée en USB peut être débuggée avec AndroidStudio, en sélectionnant la tablette dans la barre du haut, et les logs en forme de chat en bas à gauche. Filtrer avec "Capacitor".

Test en développement
Exécuter npm run build:androiddev pour mettre à jour le projet. Voir .env.androiddev On peut directement tester en simulation depuis Android Studio, ou sur un device simplement en le branchant et en le sélectionnant dans la barre du haut.

Logs
Pour voir les logs, c'est l'icone en forme de chat dans la barre vertical en bas à gauche. Filtrer les lignes "Capacitor"

Numéro de version
Dans build.gradle (:app)

Construction des App Bundle
"App bundles" = archive contenant le code compilé + fichiers de configuration. Obligatoire maintenant à la place des fichiers .apk C'est Google Play qui construit les .apk en fonction du device et du contexte

Suivre exactement les instructions (complexes) de https://developer.android.com/studio/publish/app-signing?hl=fr

Ces "App bundle" doivent être signés avant d'être uploadés sur Google Play Console. Les clés sont situées dans un 'keystore': frontend/android-keystore/keystore.jks, mdp : Me Clé d'importation 'upload' dans ce keystore pour l'importation des "App Bundle", mdp Me

dans build.gradle, changer les numéros, par ex : versionCode 52 versionName "0.9.52"
Build du App Bundle : Build -> Generate Signed Bundle/APK CHOISIR "BUILD VARIANT" RELEASE App Bundle (.aab) créé dans frontend/android/app/release
Upload du build dans Google Play Console : Explorateur d'App Bundle
https://play.google.com/console/u/1/developers/?%3Bhl=fr&hl=fr Choisir l'application -> "Publier" (colonne gauche) -> "Explorateur d'app Bundle" -> "Importer une nouvelle version" (en haut à droite, peu visible)

Les App Bundle seront alors dans une "bibliothèque". Pour les tests internes, fermés, ouverts, distribution, on pourra prendre les différentes versions dans cette bibliothèque

Tests internes
dans Google Play Console, sélectionner l'application, puis aller dans "Publier" -> "Tests" -> "Tests internes"
dans l'onglet 'version', cliquer sur 'Créer une version' ; importer l'AppBundle depuis la bibliothèque ou un fichier
dans l'onglet 'testeurs' cocher la liste des testeurs ; en bas de la page il y a le lien de test
Tests fermés
NÉCESSAIRE DE LES FAIRES AVEC 20+ TESTEURS POUR POUVOIR SOUMETTRE À PUBLICATION ! Voir : https://support.google.com/googleplay/android-developer/answer/14151465

Partage pour tests (?)
https://play.google.com/console/u/0/internal-app-sharing?hl=fr

inApp purchase des abonnements
Voir : https://developer.android.com/google/play/billing Depuis aout 2024, nouvelle version du billing system.

définir dans Google Play Console les 4 abonnements avec leur nom, description, prix, périodicité Leurs product id doivent être 'standard_monthly', 'standard_yearly', 'premium_monthly', 'premium_yearly'

Ne marche pas en simulation, ne marche pas avec un device réel en exécution immédiate

on peut tester les inapp en dev avec exécution sur un device et avec un compte Google normal comme buisson.jc7@gmail.com

utiliser une release de test uploadée dans Google Play Console. Attention, les achats sont réels, y a-t-il un moyen d'avoir des achats fictifs ?

Ajouter dans build.gradle (chevron "Gradle scripts" dans la liste de gauche):

dependencies {
   ...
   def billing_version = "7.0.0"
   implementation "com.android.billingclient:billing:$billing_version"
}
Ajouter dans AndroidManifest.xml:
   <uses-permission android:name="com.android.vending.BILLING" />
Nécessaire d'ajouter un test de license dans Google Play Console : Paramètres -> Test de license
Génération des icons / splash screens pour la distribution dans les stores
Utilisation de capacitor-assets. Il cherche dans ./assets les fichiers logo.png et splash.png

npx capacitor-assets generate --ios
npx capacitor-assets generate --android
npx capacitor-assets generate --pwa
Pas de sessions
Ça complique inutilement ; sur les mobiles une session peut durer plusieurs jours.

Les événements sont datés et relatifs à l'utilisateur après authentification. Les sessions pourront être déterminées après-coup en regroupant les événements.

Indexedb
Indexedb est utilisé pour le cache local au lieu de LocalStorage, pour des raisons de taille
vueuse/useIDBKeyval est utilisé pour gérer Indexedb de façon réactive; il est basé sur le package idb-keyval
Routage
Après login local ou OAuth2, un accès à '/home/:userid' est effectué, qui conduit à stocker :userid dans sessionStorage sous la clé 'userid'. Selon le type de l'utilisateur, il est redirigé vers '/student' ou '/admin'. Dans leur beforeEnter, ces routes ajoutent la propriété 'userid' dont la valeur est prise dans sessionStorage. Les url ne contiennent donc jamais l'identifiant de l'utilisateur et peuvent être utilisées comme liens dans les pages de cours par exemple

Page de présentation
Essais avec vike.js sans succès. Mis un proxypass vers express pour /presentation et mis une règle de routage app.get('/presentation') (voir presentation.middleware.js) Produit une page HTML directement, ou en utilisant la fonction SSR renderToString de VueJS

Parsing (abandonné)
PEGJS (projet cloné dans CLONES) https://shamansir.github.io/pegjs-fn/ https://github.com/pegjs/pegjs

pegjs grammar.pegjs    # génère 'grammar.js'
(Alternative) https://github.com/kach/nearley https://omrelli.ug/nearley-playground/

PWA
PWA manifest
La doc est incomplète, notamment sur les icones. Utilisé : https://stackoverflow.com/questions/62373216/vue-pwa-plugin-manifest-doesnt-use-my-config-attributes Il faut éditer la section 'pwa' de vue.config.js Lors du build, un fichier manifest.json sera généré dans dist/

PWA, service workers
SW : https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API/Using_Service_Workers VueJS cache busting : https://medium.com/js-dojo/vuejs-pwa-cache-busting-8d09edd22a31

PWA web push
see: https://developers.google.com/web/ilt/pwa/introduction-to-push-notifications

à chaque destinataire de notification correspond une 'subscription', qui représente une adresse d'envoi, sur un device donné pour une application donnée. Si l'utilisateur se connecte à l'application avec N devices, les notifications seront envoyées aux N subscriptions associées Une subscription est créé côté client par la méthode getWebPushSubscription via le service worker / push manager ATTENTION : cette méthode doit être appelée dans le handler d'un GESTE UTILISATEUR. Dans l'application, on profite du bouton "Continuer" de WelcomeStudent.vue
iOS : après installation sur l'écran d'accueil (ou réinstallation), l'application n'apparait pas tout de suite dans la liste des applications. À l'appui sur "Continuer", à la création de la première subscription, iOS demande à l'utilisateur s'il autorise les notifications. Après acceptation et création de la première subscription, l'application apparait dans la liste.

app.service('notifications).addSubscription({userId, subscription}) permet au serveur de mémoriser une nouvelle subscription pour un utilisateur.

app.service('notification').pushNotification(userId, data) permet au serveur d'envoyer une notification à toutes les subscriptions d'un client

la librairie 'web-push' simplifie l'implémentation du protocole; le cryptage s'appuie sur des 'vapid-keys'. Les mêmes 'vapid-keys' sont utilisées pour le serveur et pour tous les clients

Vapid keys (création : scrips/create-valid-keys.js) Public Key: BCb26MnBWZp7X38igiSV-JZp4EIqRJ9NeiIGhjpFM_3Rs3y_6C08YNA7d1IVKR64uqmP0csnS7KmLVkn4bAiHuQ Private Key: dh5acZXqHarphMNw6pDOgtgIG8fbxvC4qdprsnbkedg

Anatomie 2D (abandonné)
A partir d'un fichier SVG chargé par l'admin, le contenu HTML/SVG est stocké dans la BD. Les éléments 'path' du SVG qu'on souhaite mettre en valeur sont enrichis d'attributs 'data-rank' et 'data-name'. Le innerHTML correspondant est stocké dans la BD et contient toute l'information nécessaire.

Deep links (abandonné)
Abandonné pour ce projet, mais tests réussis sur iOS : https://capacitorjs.com/docs/guides/deep-links Permet de lancer directement l'application en cliquant sur un lien web. L'application doit être configurée pour connaitre le site web, et le site web doit connaitre l'appli ios avec un fichier accessible à l'url /well-known/

Modèles 3D
vue-3d-loader : https://github.com/king2088/vue-3d-loader/tree/master/src/examples

https://sketchfab.com/ https://www.mixamo.com

Références utiles
MSD manuals : https://www.msdmanuals.com# infirmier
