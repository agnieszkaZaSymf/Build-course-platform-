import { pgTable, uuid, primaryKey } from "drizzle-orm/pg-core";
import { CourseTable } from "./course";
import { ProductsTable } from "./products";
import { createdAt, updatedAt } from "../schemaHelpers";
import { relations } from "drizzle-orm";

// tabela pośrednia miedzy kursami a produktami.
// kazdy kurs ma wiele produktow.
// kazdy produkt moze byc w wielu kursach.

export const CourseProductTable = pgTable(
  "course_products",
  {
    courseId: uuid()
      .notNull()
      .references(() => CourseTable.id, { onDelete: "restrict" }),
    productId: uuid()
      .notNull()
      .references(() => ProductsTable.id, { onDelete: "cascade" }),
    createdAt,
    updatedAt,
  },
  (t) => [primaryKey({ columns: [t.courseId, t.productId] })]
);

export const CourseProductRelationships = relations(
  CourseProductTable,
  ({ one }) => ({
    course: one(CourseTable, {
      fields: [CourseProductTable.courseId],
      references: [CourseTable.id],
    }),
    product: one(ProductsTable, {
      fields: [CourseProductTable.productId],
      references: [ProductsTable.id],
    }),
  })
);
