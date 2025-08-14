import { getGlobalTag, getIdTag } from "@/lib/dataCache";
import { revalidateTag } from "next/cache";

// za kazdym razem gdy użytkownik jest tworzony, aktualizowany lub usuwany, cache jest rewalidowany
export function getUserGlobalTag() {
  return getGlobalTag("users");
}

// za kazdym gdy zmieniamy użytkownika na konkretnym id, cache jest rewalidowany dla tego użytkownika
// to pozwala na szybkie odświeżenie cache dla konkretnego użytkownika bez potrzeby odświeżania całego cache dla wszystkich użytkowników
export function getUserIdTag(id: string) {
  return getIdTag("users", id);
}

// za każdym razem gdy użytkownik jest tworzony, aktualizowany lub usuwany, zweryfikowany jest cache dla tego użytkownika
// przekaze id użytkownika do funkcji revalidateUserCache, która wywoła rewalidację cache dla tego użytkownika
//
export function revalidateUserCache(id: string) {
  // Revalidate the global user cache and the specific user cache
  revalidateTag(getUserGlobalTag());
  // This will trigger a revalidation for the specific user cache
  revalidateTag(getUserIdTag(id));
}
