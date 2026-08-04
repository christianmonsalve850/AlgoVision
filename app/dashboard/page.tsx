import DashboardHeader from "@/features/dashboard/components/dashboard-header";
import ProblemsSolved from "@/features/dashboard/components/problems-solved";
import SmallWidget from "@/features/dashboard/components/small-widget";
import { TrendingUp, Flame, Clock, BookOpen } from "lucide-react";

export default function Dashboard() {

  return ( 
    <main className="flex min-h-[calc(100vh-4rem)] flex-col bg-background p-6 gap-5">
      <DashboardHeader />
      <ProblemsSolved />
      <div className="grid grid-cols-4 gap-4">
        <SmallWidget 
          icon={TrendingUp} 
          icon_bg="bg-emerald-500/10 dark: bg-emerald-500/20" 
          icon_color="text-emerald-600 dark:text-emerald-400" 
          title="Categories Mastered"
          value="3"
          subtext="of 8 total"
        />
        <SmallWidget 
          icon={Flame} 
          icon_bg="bg-orange-500/10 dark: bg-orange-500/20" 
          icon_color="text-orange-600 dark:text-orange-400" 
          title="Current Streak"
          value="3"
          subtext="days in a row"
        />
        <SmallWidget 
          icon={Clock} 
          icon_bg="bg-amber-500/10 dark: bg-amber-500/20" 
          icon_color="text-amber-600 dark:text-amber-400" 
          title="Latest Problem"
          value="Easy"
          subtext="Two Sum"
        />
        <SmallWidget 
          icon={BookOpen} 
          icon_bg="bg-indigo-500/10 dark:bg-indigo-500/20" 
          icon_color="text-indigo-600 dark:text-indigo-400" 
          title="Categories Mastered"
          value="3"
          subtext="of 8 total"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">

      </div>
    </main>
  );
}
