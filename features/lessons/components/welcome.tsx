
interface WelcomeProps {
  title?: string;
  text?: string;
}

export const Welcome: React.FC<WelcomeProps> = ({ title, text }) => {
    return (
        <div className="rounded-xl border border-border bg-card/95 shadow-sm my-6 p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-400">Welcome</p>
            <p className="mt-1.5 text-xl font-bold tracking-tight text-foreground">{title}</p>
            <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground">{text}</p>
        </div>
    )
}