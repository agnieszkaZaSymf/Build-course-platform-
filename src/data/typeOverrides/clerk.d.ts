import { UserRole } from "@/drizzle/schema";

export {};

declare global {
  interface ClerkJwtSessionClaims {
    dbId?: string;
    role?: UserRole;
  }

  // db i role jest opcjonalny, bo może istnieć stan w ktorym clerk z przypisanym uzytkownikiem
  // ale nie zostal zsynchronizowany z bazą danych
  interface ClerkPublicMetadata {
    dbId?: string;
    role?: UserRole;
  }
}
