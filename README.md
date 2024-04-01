# Journal de bord infirmier

Dès que la connexion est établie, le client stocke socket.id dans sessionStorage
Cela permet de rétablir socket.data et socket.rooms en cas de reload de la page et lors de l'authentification Google (transfer.js)

Lors de l'authentification Google, la connexion est perdue.
Elle est reprise (avec transfert) lors de la redirection vers /home/student/:userid

Il faut que dans les deux situations d'authentification (locale ou Google), socket.data.user et socket.data.expiresAt soient affecté
Cela est réalisé avec une garde 'before' de vue-router sur la route /home/student/:userid, qui appelle un service auth/setCnxUser
