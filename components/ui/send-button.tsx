import { Send } from "lucide-react"

interface SendButtonProps {
  children: React.ReactNode;
}

export function SendButton({children}: SendButtonProps) {
    return (
        <button
            type="button"
            className="inline-flex items-center gap-2 rounded-lg bg-foreground px-3 py-2 text-xs font-medium text-background transition-colors hover:opacity-90"
        >
            <Send className="size-3.5" />
            Submit
        </button>
)
}