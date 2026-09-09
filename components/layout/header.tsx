import { Brand } from "@/components/layout/brand"
import { ThemeToggle } from "@/components/theme/theme-toggle"
import { HeaderNav } from "@/components/layout/header-nav"
import { AccountButton } from "@/components/layout/account-button"

export default function Header() {
    return (
        <header className="sticky top-0 flex h-16 w-full items-center border-b border-border bg-background/90 px-6 backdrop-blur justify-between py-5">
            
            <Brand />
            
            <HeaderNav />
            <div className="flex gap-3">
                <ThemeToggle />
                <AccountButton />
            </div>
            
        </header>
    )
}