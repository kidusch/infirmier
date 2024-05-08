# Journal de bord infirmier

## Authentification

Voir [./documentation/auth-workflow.svg](schéma)

Google Developers Console : https://console.cloud.google.com/apis/dashboard?project=infirmier-418706


## BUGS


## Parsing
https://github.com/kach/nearley
https://omrelli.ug/nearley-playground/


## Client

Nom : Fantone
Prénom : Charlene
Email : devenir.linfirmier.que.tu.veux.etre@gmail.com

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

