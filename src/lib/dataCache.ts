type CACHE_TAG =
  | "products"
  | "users"
  | "courses"
  | "userCourseAccess"
  | "courseSections"
  | "lessons"
  | "purchases";

// global cache tag for all users
export function getGlobalTag(tag: CACHE_TAG) {
  return `global:${tag}` as const;
}

// id cache tag for specific user
export function getIdTag(tag: CACHE_TAG, id: string) {
  return `id:${id}-${tag}` as const;
}

// user cache tag for specific user, for example what purchases a user has made, what lessons marked as completed, etc.
export function getUserTag(tag: CACHE_TAG, userId: string) {
  return `user:${userId}-${tag}` as const;
}

// course cache tag for specific course, for example what products are in the course, what sections it has, etc.
export function getCourseTag(tag: CACHE_TAG, courseId: string) {
  return `course:${courseId}-${tag}` as const;
}
