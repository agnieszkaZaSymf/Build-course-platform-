import { relations } from "drizzle-orm";
import { pgTable, text, integer, pgEnum } from "drizzle-orm/pg-core";
import { createdAt, id, updatedAt } from "../schemaHelpers";
import { CourseProductTable } from "./courseProduct";

export const productStatus = ["public", "private"] as const;
export type ProductStatus = (typeof productStatus)[number];
export const productsStatusEnum = pgEnum("product_status", productStatus);

export const ProductsTable = pgTable("products", {
  id,
  name: text().notNull(),
  description: text().notNull(),
  imageUrl: text().notNull(),
  priceInDollars: integer().notNull(),
  status: productsStatusEnum().notNull().default("private"),
  createdAt,
  updatedAt,
});

// 1 produkt moze byc w wielu kursach. dzieki
export const ProductsRelationships = relations(ProductsTable, ({ many }) => ({
  courseProducts: many(CourseProductTable),
}));
