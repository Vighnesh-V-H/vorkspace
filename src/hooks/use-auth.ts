import { authClient } from "@/lib/auth/auth-client";

export function useAuth() {
  const session = authClient.useSession();
  return { session };
}
