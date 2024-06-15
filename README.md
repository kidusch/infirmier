# Journal de bord infirmier

## Authentification

Voir [./documentation/auth-workflow.svg](schéma)

Google Developers Console : https://console.cloud.google.com/apis/dashboard?project=infirmier-418706


## BUGS

pg_dump -a --inserts infirmier-prod  --exclude-table-data=user --exclude-table-data=highlighted_part --exclude-table-data=user_action --exclude-table-data=user_topic --exclude-table-data=user_course --exclude-table-data=user_card --exclude-table-data=user_quiz --exclude-table-data=user_quiz_choice --exclude-table-data=user_case_study --exclude-table-data=_prisma_migrations  > xxx.sql

delete from admin_misc, ue, sub_ue, topic, course, card, case_study, quiz, quiz_choice


FAUT-IL SUPPRIMER user_topic ? 


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

