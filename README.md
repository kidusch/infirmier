# Journal de bord infirmier

Lors de l'authentification Google, la connexion est perdue.
Elle est reprise (avec transfert) lors de la redirection vers /home/student/:userid

Il faut que dans les deux situations d'authentification (locale ou Google), socket.data.user soit affecté
Cela est réalisé avec une garde 'before' de vue-router sur la route /home/student/:userid, qui appelle un service auth/setCnxUser
