
export default function (app) {

   app.createService('admin_misc', app.get('prisma').admin_misc)

}
