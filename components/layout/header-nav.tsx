import Link from "next/link";
import { LayoutDashboard, BookOpen, Target, Video } from "lucide-react";

export function HeaderNav() {
    return (
        <nav className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 hidden md:flex gap-6">
            <Link href="/dashboard" className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors">
                <LayoutDashboard className="w-4 h-4" /> 
                <span>Dashboard</span>
            </Link>
            <Link href="/learn" className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors">
                <BookOpen className="w-4 h-4" /> 
                <span>Learn</span>
            </Link>
            <Link href="/practice" className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors">
                <Target className="w-4 h-4" /> 
                <span>Practice</span>
            </Link>
            <Link href="/interview" className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors">
                <Video className="w-4 h-4" /> 
                <span>Interview</span>
            </Link>
        </nav>
    )
}