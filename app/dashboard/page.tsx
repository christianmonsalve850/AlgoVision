import { SignOutButton } from "@/features/auth/components/sign-out-button";

export default function Dashboard() {

  return ( 
    <main className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center bg-background px-6">
        <h1 className="text-foreground">Dashboard</h1>
        <SignOutButton />
    </main>
  );
}
