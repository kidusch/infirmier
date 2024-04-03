
import nodemailer from 'nodemailer'


export default function (app) {

   app.createService('mail', {
      send: ({ from, to, subject, text, html }) => {
         const transporter = nodemailer.createTransport(app.get('config').NODEMAILER)
         return transporter.sendMail({ from, to, subject, text, html })
      },
   })
}
