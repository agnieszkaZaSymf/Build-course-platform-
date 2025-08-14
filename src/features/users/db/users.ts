import { db } from "@/drizzle/db";
import { UserTable } from "@/drizzle/schema";
import { eq } from "drizzle-orm";
import { revalidateUserCache } from "./cache";

// users file is just to interact with database for user-related operations, how to insert, update, delete users
// onConflictDoUpdate is used to handle the case where a user with the same clerkUserId already exists in the database. i want to update the existing user instead of inserting a new one.
// onConflictDoUpdate target is the column that we want to check for conflicts, in this case, clerkUserId. If a conflict is found, the set object will be used to update the existing user with the new data.
export async function insertUser(data: typeof UserTable.$inferInsert) {
  const [newUser] = await db
    .insert(UserTable)
    .values(data)
    .returning()
    .onConflictDoUpdate({
      target: UserTable.clerkUserId,
      set: data,
    });

  if (newUser == null) throw new Error("Failed to create user");
  revalidateUserCache(newUser.id);

  return newUser;
}

// we use Partial<typeof UserTable.$inferInsert> to allow updating only specific fields of the user
// we use eq(UserTable.clerkUserId, clerkUserId) to find the user
// where eq is a function from drizzle-orm that creates a condition to match the clerkUserId
export async function updateUser(
  { clerkUserId }: { clerkUserId: string },
  data: Partial<typeof UserTable.$inferInsert>
) {
  const [updatedUser] = await db
    .update(UserTable)
    .set(data)
    .where(eq(UserTable.clerkUserId, clerkUserId))
    .returning();
  if (updatedUser == null) throw new Error("Failed to update user");
  revalidateUserCache(updatedUser.id);

  return updatedUser;
}

// to jest soft delete, użytkownik nie jest fizycznie usuwany z bazy. Zamiast tego rekord jest oznaczany jako usunięty i dane są anonimizowane. Ustawia time usunięcia, zastepuje email i imię na wartości domyślne, ustawia clerkUserId na "deleted" i usuwa obrazek użytkownika.
// dlatego, że nie chcemy usuwać użytkownika fizycznie z bazy danych, ponieważ może być to potrzebne do zachowania historii transakcji lub innych danych związanych z użytkownikiem. Zamiast tego, oznaczamy go jako usuniętego i anonimizujemy jego dane.
export async function deleteUser({ clerkUserId }: { clerkUserId: string }) {
  const [deletedUser] = await db
    .update(UserTable)
    .set({
      deletedAt: new Date(),
      email: "redacted@deleted.com",
      name: "Deleted User",
      clerkUserId: "deleted",
      imageUrl: null,
    })
    .where(eq(UserTable.clerkUserId, clerkUserId))
    .returning();
  if (deletedUser == null) throw new Error("Failed to update user");
  // usunąć użytkownika z cache, zapewnia ze kolejne zapytania nie będą zwracać usuniętego użytkownika, pobierze świeże dane z bazy danych
  revalidateUserCache(deletedUser.id);

  return deletedUser;
}
