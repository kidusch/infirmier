
module.exports = {
   PORT: process.env.PORT,
   LOGS_DIR: process.env.LOGS_DIR,
   DATABASE_URL: process.env.DATABASE_URL,

   WS_TRANSPORT: true,
   WS_PATH: '/infirmier-socket-io/',

   SESSION_EXPIRE_DELAY: 30 * 60*1000, // 30mn: delay of inactivity before expiration - see auth.extendSession
   AUTHCODE_EXPIRE_DELAY: 10 * 60*1000, // 10mn: expiration delay for authorization codes

   DOMAIN: process.env.DOMAIN,

   EMAIL_FROM: process.env.MAIL_SENDER,
   NODEMAILER: {
      host: process.env.MAIL_HOST,
      port: process.env.MAIL_PORT,
      secure: false,
      auth: {
         user: process.env.MAIL_USER,
         pass: process.env.MAIL_PASSWORD,
      },
      name: process.env.MAIL_DOMAIN,
   },
 
   WEBPUSH: {
      publicKey: "BK0ctCYOnwYHK9y3kw9Sck85PnMGSo7-m11Gyo3kYbYi1hKxVxF-XrZa76zDhFgQC61WcTVWdtN8IjeMUuCgJCQ",
      privateKey: "DGT86VElbQbO_iW_jq9f1OeZ6R7Ygv-7llG2tu1-mUs"
   },

}

