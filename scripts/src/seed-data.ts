import { db } from "@workspace/db";
import {
  applicationsTable,
  collegesTable,
  contactMessagesTable,
  newsTable,
  programsTable,
} from "@workspace/db";

async function main() {
  console.log("Seeding data...");

  const [college] = await db
    .insert(collegesTable)
    .values({
      nameAr: "كلية الهندسة والتكنولوجيا",
      nameEn: "College of Engineering and Technology",
      slug: "engineering-and-technology",
      descriptionAr: "كلية رائدة في مجالات الهندسة والتقنية.",
      descriptionEn: "A leading college in engineering and technology fields.",
      status: "published",
    })
    .returning();

  const [program] = await db
    .insert(programsTable)
    .values({
      collegeId: college.id,
      nameAr: "هندسة البرمجيات",
      nameEn: "Software Engineering",
      slug: "software-engineering",
      level: "bachelor",
      descriptionAr: "برنامج يركز على تصميم وتطوير البرمجيات.",
      descriptionEn: "A program focused on software design and development.",
      status: "published",
    })
    .returning();

  await db.insert(applicationsTable).values({
    programId: program.id,
    fullNameAr: "أحمد محمد",
    fullNameEn: "Ahmed Mohammed",
    email: "ahmed@example.com",
    phone: "0501234567",
    status: "new",
  });

  await db.insert(contactMessagesTable).values({
    name: "سارة علي",
    email: "sara@example.com",
    subject: "استفسار عن القبول",
    message: "متى يبدأ موعد القبول للفصل الدراسي الثاني؟",
    status: "new",
  });

  await db.insert(newsTable).values({
    titleAr: "افتتاح المعمل الجديد",
    titleEn: "Opening of the New Lab",
    slug: "opening-of-the-new-lab",
    summaryAr: "تم افتتاح معمل الذكاء الاصطناعي الجديد في الكلية.",
    summaryEn: "The new AI lab was opened in the college.",
    contentAr: "محتوى الخبر...",
    contentEn: "News content...",
    type: "news",
    status: "published",
    publishedAt: new Date().toISOString(),
  });

  console.log("Seeding completed!");
}

main().catch((error: unknown) => {
  console.error(error);
  process.exitCode = 1;
});
