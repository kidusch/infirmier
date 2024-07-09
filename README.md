
# Journal de bord infirmier

- spécification client : https://onedrive.live.com/edit?id=F3D5CD9650AC97DE!4629&resid=F3D5CD9650AC97DE!4629&ithint=file%2cdocx&authkey=!AHjAXRVgmUv7wfw&wdo=2&cid=f3d5cd9650ac97de
- Figma : https://www.figma.com/design/WMk1ig0gMqx2XVHy664eqP/Devenir-Infirmier?node-id=0-1&t=bznsOdhjUDkAqLcV-0


## Authentification

Voir [./documentation/auth-workflow.svg](schéma)

Google Developers Console : https://console.cloud.google.com/apis/dashboard?project=infirmier-418706


## BUGS

pg_dump -a --inserts infirmier-prod --exclude-table-data=user --exclude-table-data=highlighted_part --exclude-table-data=user_action --exclude-table-data=user_topic --exclude-table-data=user_course --exclude-table-data=user_card --exclude-table-data=user_quiz --exclude-table-data=user_quiz_choice --exclude-table-data=user_case_study --exclude-table-data=_prisma_migrations > xxx.sql

delete from admin_misc;
delete from ue;
delete from sub_ue;
delete from topic;
delete from course;
delete from card;
delete from case_study;
delete from quiz;
delete from quiz_choice;



## Parsing

PEGJS (projet cloné dans CLONES)
https://shamansir.github.io/pegjs-fn/
https://github.com/pegjs/pegjs

```
pegjs grammar.pegjs    # génère 'grammar.js'
```

(Alternative)
https://github.com/kach/nearley
https://omrelli.ug/nearley-playground/



## Client

Nom : Fantone
Prénom : Charlene
Email : devenir.linfirmier.que.tu.veux.etre@gmail.com
admin@journaldebordide.com

Téléphone : +41767338336

Adresse :
Impasse du plan 1
1730 Ecuvillens
Suisse


## Références utiles

MSD manuals : https://www.msdmanuals.com


## Choix techniques

### Authentification

Voir documentation/doc/auth_workflow.svg


### Pas de sessions

Ça complique inutilement ; sur les mobiles une session peut durer plusieurs jours.

Les événements sont datés et relatifs à l'utilisateur après authentification.
Les sessions pourront être déterminées après-coup en regroupant les événements.



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
