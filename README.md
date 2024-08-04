
# Journal de bord infirmier

- Charlène Fantone, devenir.linfirmier.que.tu.veux.etre@gmail.com, +41767338336, Impasse du plan 1, 1730 Ecuvillens, Suisse

- spécification client : https://onedrive.live.com/edit?id=F3D5CD9650AC97DE!4629&resid=F3D5CD9650AC97DE!4629&ithint=file%2cdocx&authkey=!AHjAXRVgmUv7wfw&wdo=2&cid=f3d5cd9650ac97de
- Figma : https://www.figma.com/design/WMk1ig0gMqx2XVHy664eqP/Devenir-Infirmier?node-id=0-1&t=bznsOdhjUDkAqLcV-0


## Authentification

Voir [./documentation/auth-workflow.svg](schéma)

Google Developers Console : https://console.cloud.google.com/apis/dashboard?project=infirmier-418706


## Pas de sessions

Ça complique inutilement ; sur les mobiles une session peut durer plusieurs jours.

Les événements sont datés et relatifs à l'utilisateur après authentification.
Les sessions pourront être déterminées après-coup en regroupant les événements.


## Indexedb

Indexedb est utilisé pour le cache local au lieu de LocalStorage, pour des raisons de taille
vueuse/useIDBKeyval est basé sur idb-keyval


## Routage

Après login local ou OAuth2, un accès à '/home/:userid' est effectué, qui conduit à stocker `:userid` dans sessionStorage sous la clé 'userid'.
Selon le type de l'utilisateur, il est redirigé vers '/student' ou '/admin'.
Dans leur `beforeEnter`, ces routes ajoutent la propriété 'userid' dont la valeur est prise dans sessionStorage.
Les url ne contiennent donc jamais l'identifiant de l'utilisateur et peuvent être utilisées comme liens dans les pages de cours par exemple


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

- chaque destinataire de notification doit créer une 'subscription', qui représente une adresse d'envoi.
`app.service('notifications).create({userId, subscription})` permet au serveur de mémoriser les subscriptions de chaque utilisateur,
elle est (re)créée à chaque login (car elle est susceptible de changer)
- `app.service('notification').patch(userId, data)` permet au serveur d'envoyer une notification à un client,
en utilisant la subscription qui a été mémorisée pour lui
- la librairie 'web-push' simplifie l'implémentation du protocole; le cryptage s'appuie sur des 'vapid-keys'.
Les mêmes 'vapid-keys' sont utilisées pour le serveur et pour tous les clients.
- la demande d'autorisation d'utiliser les notifications est faite dans `main.js`

Vapid keys (création : scrips/create-valid-keys.js)
Public Key: BCb26MnBWZp7X38igiSV-JZp4EIqRJ9NeiIGhjpFM_3Rs3y_6C08YNA7d1IVKR64uqmP0csnS7KmLVkn4bAiHuQ
Private Key: dh5acZXqHarphMNw6pDOgtgIG8fbxvC4qdprsnbkedg


# Anatomie 2D (abandonné)

A partir d'un fichier SVG chargé par l'admin, le contenu HTML/SVG est stocké dans la BD.
Les éléments 'path' du SVG qu'on souhaite mettre en valeur sont enrichis d'attributs 'data-rank' et 'data-name'.
Le innerHTML correspondant est stocké dans la BD et contient toute l'information nécessaire.


# Modèles 3D

https://vue-3d-model.netlify.app/en/guide/installation/

https://threejs.org/examples/webgl_loader_fbx.html

https://www.mixamo.com


## Références utiles

MSD manuals : https://www.msdmanuals.com
