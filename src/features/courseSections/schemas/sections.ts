import { courseSectionStatus } from "@/drizzle/schema";
import { z } from "zod";

export const sectionSchema = z.object({
  name: z.string().min(1, "Required"),
  status: z.enum(courseSectionStatus),
});

export const SectionsSchema = z.array(sectionSchema);
export type SectionSchema = z.infer<typeof sectionSchema>;
