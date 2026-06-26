'use client';

import { useRouter } from "next/navigation";
import { signOut } from "@/features/auth/actions/sign-out";

export function SignOutButton() {
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    router.replace("/");
  };

  return (
    <button
      onClick={handleSignOut}
      className="rounded-2xl border border-border bg-background px-4 py-3 text-foreground transition-colors hover:bg-muted"
    >
      Sign Out
    </button>
  );
}
