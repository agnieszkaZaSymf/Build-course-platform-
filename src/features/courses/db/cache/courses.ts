import { getGlobalTag, getIdTag } from "@/lib/dataCache";
import { revalidateTag } from "next/cache";

export function getCourseGlobalTag() {
  return getGlobalTag("courses");
}

export function getCourseIdTag(id: string) {
  return getIdTag("courses", id);
}

export function revalidateCourseCache(id: string) {
  // Revalidate the global course cache and the specific course cache
  revalidateTag(getCourseGlobalTag());
  // This will trigger a revalidation for the specific course cache
  revalidateTag(getCourseIdTag(id));
}
