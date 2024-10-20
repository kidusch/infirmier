
import { PrismaClient } from '@prisma/client'


async function main() {
   try {
      // create prisma client
      const prisma = new PrismaClient()

      const courseIdList = await prisma.course.findMany({
         select: {
            id: true,
         }
      })
      for (const courseId of courseIdList) {
         const course = await prisma.course.findUnique({ where: { id: courseId.id }})
         const courseContent = await prisma.course_content.create({
            data: {
               course_id: courseId.id,
               content: course.content,
            }
         })
         console.log('courseContent', courseContent)
      }
   } catch(err) {
      console.error(err.toString())
   } finally {
      process.exit(0)
   }
}

main()
