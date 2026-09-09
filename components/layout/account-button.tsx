"use client";

import Image from "next/image";
import { useUserProfile } from "@/hooks/use-user-profile";

export function AccountButton() {
  const { avatarUrl } = useUserProfile();

  return (
    <>
      {avatarUrl ? (
        <button className="flex items-center justify-center rounded-full border border-border p-1 hover:bg-muted transition">
          <Image
            src={avatarUrl}
            alt="User Profile"
            width={32}
            height={32}
            className="rounded-full object-cover"
          />
        </button>
      ) : (
        <button className="rounded-sm border border-border bg-background flex items-center justify-center text-muted-foreground hover:text-foreground font-semibold text-sm px-2">
          Sign In
        </button>
      )}
    </>
  );
}
