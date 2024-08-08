
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import inquirer from 'inquirer'


async function main() {
   try {
      // create prisma client
      const prisma = new PrismaClient()

      const answers = await inquirer.prompt([
         {
            name: 'email',
            type: 'text',
            message: "Entrez l'email",
         },
         {
            name: 'name',
            type: 'text',
            message: "Entrez le nom",
         },
         {
            name: 'password',
            type: 'password',
            message: "Entrez le mot de passe",
         },
         {
            name: 'confirmPassword',
            type: 'password',
            message: "Confirmez le mot de passe",
         },
      ])
      if (answers.password !== answers.confirmPassword) {
         console.log("Les deux mots de passe ne sont pas identiques")
         return
      }

      const encryptedPassword = await bcrypt.hash(answers.password, 5)
      const admin = await prisma.user.create({
         data: {
            email: answers.email,
            password: encryptedPassword,
            name: answers.name,
            admin: true,
         }
      })
      console.log('admin', admin)

      console.log("Admin créé avec succès")

   } catch(err) {
      console.error(err.toString())
   } finally {
      process.exit(0)
   }
}

main()
