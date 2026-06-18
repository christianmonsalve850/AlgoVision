import { Brand } from "./brand"
import { ThemeToggle } from "@/components/theme/theme-toggle"
import { HeaderNav } from "./header-nav"

export default function Header() {
    return (
        <header className="sticky top-0 flex h-16 w-full items-center border-b border-border bg-background/90 px-6 backdrop-blur justify-between">
            
            <Brand />
            
            <HeaderNav />
            
            <ThemeToggle />
            
        </header>
    )
}