import { getUserIdTag } from "@/features/users/db/cache";
import { db } from "@/drizzle/db";
import { UserRole, UserTable } from "@/drizzle/schema";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { cacheTag } from "next/dist/server/use-cache/cache-tag";
import { redirect } from "next/navigation";

const client = await clerkClient();

// ten kod zawiera funkcje do pobierania i synchronizacji danych użytkowników z Clerk. Auth jest używany do uzyskania informacji o bieżącym użytkowniku, a `syncClerkUserMetadata` aktualizuje metadane użytkownika w Clerk na podstawie danych z bazy danych aplikacji.
export async function getCurrentUser({ allData = false } = {}) {
  const { userId, sessionClaims, redirectToSignIn } = await auth();

  if (userId != null && sessionClaims.dbId == null) {
    // Pobierz użytkownika z Clerk, aby uzyskać jego metadane
    redirect("/api/clerk/syncUsers");
  }

  return {
    clerkUserId: userId, // ID użytkownika w Clerk
    userId: sessionClaims?.dbId, // ID użytkownika w lokalnej bazie danych
    role: sessionClaims?.role, // rola użytkownika
    user:
      allData && sessionClaims?.dbId != null
        ? await getUser(sessionClaims.dbId as string)
        : undefined,
    redirectToSignIn,
  };
}

// Funkcja synchronizuje metadane użytkownika w Clerk z danymi użytkownika w bazie danych aplikacji. Zapisuje ID użytkownika i jego rolę w metadanych publicznych Clerk, ktore potem sa dostepne w sessionClaims.
export async function syncClerkUserMetadata(user: {
  id: string;
  clerkUserId: string;
  role: UserRole;
}) {
  return client.users.updateUserMetadata(user.clerkUserId, {
    publicMetadata: {
      dbId: user.id, // ID użytkownika w lokalnej bazie danych
      role: user.role, // rola użytkownika
    },
  });
}

// Funkcja pobiera użytkownika z bazy danych na podstawie jego ID. Używa tagu cache, aby zoptymalizować wydajność i uniknąć niepotrzebnych zapytań do bazy danych.
// webhook tworzy uzytkownika - wywoluje syncClerkUserMetadata, ktory zapisuje id uzytkownika w bazie danych
async function getUser(id: string) {
  "use cache";
  cacheTag(getUserIdTag(id));
  console.log("Called");

  return db.query.UserTable.findFirst({
    where: eq(UserTable.id, id),
  });
}
