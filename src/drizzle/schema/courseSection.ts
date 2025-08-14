import { relations } from "drizzle-orm";
import { pgTable, text, integer, pgEnum, uuid } from "drizzle-orm/pg-core";
import { createdAt, id, updatedAt } from "../schemaHelpers";
import { CourseTable } from "./course";
import { LessonTable } from "./lessons";

// kazdy kurs ma wiele sekcji. sekcja ma wiele lekcji.

export const courseSectionStatus = ["public", "private"] as const;
export type CourseSectionStatus = (typeof courseSectionStatus)[number];
export const courseSectionStatusEnum = pgEnum(
  "course_section_status",
  courseSectionStatus
);

export const CourseSectionTable = pgTable("course_sections", {
  id,
  name: text().notNull(),
  status: courseSectionStatusEnum().notNull().default("private"),
  order: integer().notNull(),
  courseId: uuid()
    .notNull()
    .references(() => CourseTable.id, { onDelete: "cascade" }),
  createdAt,
  updatedAt,
});

// kazda sekcja kursu jest powiazana z jednym kursem.

export const CourseSectionRelationships = relations(
  CourseSectionTable,
  ({ one, many }) => ({
    course: one(CourseTable, {
      fields: [CourseSectionTable.courseId],
      references: [CourseTable.id],
    }),
    lessons: many(LessonTable),
  })
);
