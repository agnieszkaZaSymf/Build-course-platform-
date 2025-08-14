"use server";

import { getCurrentUser } from "@/services/clerk";
import {
  canCreateCourses,
  canDeleteCourses,
  canUpdateCourses,
} from "../permissions/courses";
import { insertCourse, deleteCourse as deleteCourseDB } from "../db/courses";
import { redirect } from "next/navigation";
import { CourseSchema, courseSchema } from "../schemas/courses";

// uzywamy unsafeData, bo nie wiemy czy te sa tym, czego spodziewamy sie. Poniewaz moze byc przekazane z formularza i to dostaniemy z tego samego typu CourseSchema
export async function createCourse(unsafeData: CourseSchema) {
  const { success, data } = courseSchema.safeParse(unsafeData);

  if (!success || !canCreateCourses(await getCurrentUser())) {
    return { error: true, message: "There was an error creating your course" };
  }

  const course = await insertCourse(data);

  redirect(`/admin/courses/${course.id}/edit`);
}

export async function updateCourse(id: string, unsafeData: CourseSchema) {
  const { success, data } = courseSchema.safeParse(unsafeData);

  if (!success || !canUpdateCourses(await getCurrentUser())) {
    return { error: true, message: "There was an error updating your course" };
  }

  await updateCourse(id, data);

  return { error: false, message: "Successfully updated your course" };
}

export async function deleteCourse(id: string) {
  if (!canDeleteCourses(await getCurrentUser())) {
    return { error: true, message: "Error deleting your course" };
  }

  await deleteCourseDB(id);

  return { error: false, message: "Successfully deleted your course" };
}
