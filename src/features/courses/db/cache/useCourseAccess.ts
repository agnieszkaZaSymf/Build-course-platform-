import { getGlobalTag, getIdTag, getUserTag } from "@/lib/dataCache";
import { revalidateTag } from "next/cache";

//  globalny tag cache'u dla wszystkich danych dostępu użytkowników do kursów. zastosowanie: Używany do unieważnienia całego cache'u dostępu do kursów dla wszystkich użytkowników naraz
export function getUserCourseAccessGlobalTag() {
  return getGlobalTag("userCourseAccess");
}

// id tag cache'u dla konkretnego użytkownika i kursu
// Pozwala na unieważnienie cache'u dla dostępu konkretnego użytkownika do konkretnego kursu
export function getUserCourseAccessIdTag({
  courseId,
  userId,
}: {
  courseId: string;
  userId: string;
}) {
  return getIdTag("userCourseAccess", `course:${courseId}-user:${userId}`);
}

// pozwala nam uzyskac pelen dostep do kursu dla jednego, konkretnego uzytkownika. Pozwala unieważnić cache wszystkich kursów, do których ma dostęp konkretny użytkownik
export function getUserCourseAccessUserTag(userId: string) {
  return getUserTag("userCourseAccess", userId);
}

// Unieważnia (rewaliduje) wszystkie powiązane cache'e po zmianie dostępu użytkownika do kursu
export function revalidateUserCourseAccessCache({
  courseId,
  userId,
}: {
  courseId: string;
  userId: string;
}) {
  revalidateTag(getUserCourseAccessGlobalTag());
  revalidateTag(getUserCourseAccessIdTag({ courseId, userId }));
  revalidateTag(getUserCourseAccessUserTag(userId));
}
