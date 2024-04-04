# Journal de bord infirmier

## Client

Nom : Fantone
Prénom : Charlene
Email : devenir.linfirmier.que.tu.veux.etre@gmail.com

Téléphone : +41767338336

Adresse :
Impasse du plan 1
1730 Ecuvillens
Suisse

# Références utiles

MSD manuals : https://www.msdmanuals.com


## Choix techniques

Dès que la connexion est établie, le client stocke socket.id dans sessionStorage
transfer.js permet de rétablir socket.data et socket.rooms en cas de reload de la page et lors de l'authentification Google.

Lors de l'authentification Google, la connexion est perdue.
Elle est reprise (avec transfert) lors de la redirection vers /home/student/:userid

Il faut que dans les deux situations d'authentification (locale ou Google), socket.data.user et socket.data.expiresAt soient affectés

