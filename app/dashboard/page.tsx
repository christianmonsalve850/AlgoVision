import { SignOutButton } from "@/features/auth/components/sign-out-button";
import DashboardHeader from "@/features/dashboard/components/dashboard-header";
import ProblemsSolved from "@/features/dashboard/components/problems-solved";

export default function Dashboard() {

  return ( 
    <main className="flex min-h-[calc(100vh-4rem)] flex-col bg-background p-6 gap-2">
      <DashboardHeader />
      <ProblemsSolved />
      {/* <SignOutButton /> */}
    </main>
  );
}
