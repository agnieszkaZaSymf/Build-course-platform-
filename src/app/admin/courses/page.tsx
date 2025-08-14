import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/PageHeader";
import Link from "next/link";
import { CourseTable } from "@/features/courses/components/CourseTable";
import { cacheTag } from "next/dist/server/use-cache/cache-tag";
import { getCourseGlobalTag } from "@/features/courses/db/cache/courses";
import { db } from "@/drizzle/db";
import {
  CourseSectionTable,
  CourseTable as DbCourseTable,
  LessonTable,
  UserCourseAccessTable,
} from "@/drizzle/schema";
import { countDistinct, asc } from "drizzle-orm";
import { eq } from "drizzle-orm";
import { getUserCourseAccessGlobalTag } from "@/features/courses/db/cache/useCourseAccess";
import { getCourseSectionGlobalTag } from "@/features/courseSections/db/cache";
import { getLessonGlobalTag } from "@/features/lessons/db/cache/lessons";

export default async function CoursesPage() {
  const courses = await getCourses(); // Assuming getCourses fetches the list of courses

  return (
    <div className="container my-6">
      <PageHeader title="Courses">
        <Button asChild>
          <Link href="/admin/courses/new">New Course</Link>
        </Button>
      </PageHeader>

      <CourseTable courses={courses} />
    </div>
  );
}
// countDistinct liczy ile ludzi ma dostep do kursu, ile lekcji ma kurs, ile sekcji ma kurs. Dlaczego distinct, bo przez join moze byc tak, ze kurs ma 2 sekcje, a w kazdej sekcji jest 2 lekcje, to wtedy dla tego kursu bedzie 4 lekcje, a powinno byc 2. Dlatego robie countDistinct
// robie leftJoin zamiast innerJoin, bo jesli mam kurs bez sekcji, to i tak chce go pokazac, bedzie wyswietlony z 0 sekcjami
async function getCourses() {
  "use cache";
  cacheTag(
    getCourseGlobalTag(),
    getUserCourseAccessGlobalTag(),
    getCourseSectionGlobalTag(),
    getLessonGlobalTag()
  );

  return db
    .select({
      id: DbCourseTable.id,
      name: DbCourseTable.name,
      sectionsCount: countDistinct(CourseSectionTable),
      lessonsCount: countDistinct(LessonTable),
      studentsCount: countDistinct(UserCourseAccessTable),
    })
    .from(DbCourseTable)
    .leftJoin(
      CourseSectionTable,
      eq(CourseSectionTable.courseId, DbCourseTable.id)
    )
    .leftJoin(LessonTable, eq(LessonTable.sectionId, CourseSectionTable.id))
    .leftJoin(
      UserCourseAccessTable,
      eq(UserCourseAccessTable.courseId, DbCourseTable.id)
    )
    .orderBy(asc(DbCourseTable.name))
    .groupBy(DbCourseTable.id);
}
