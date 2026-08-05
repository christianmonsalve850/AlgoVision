import { LucideIcon } from "lucide-react";

type SmallWidgetProps = {
  icon: LucideIcon;
  icon_bg: string;
  icon_color: string;
  title: string;
  value: string;
  subtext: string;
};

export default function SmallWidget({
  icon: Icon,
  icon_bg,
  icon_color,
  title,
  value,
  subtext,
}: SmallWidgetProps) {
  return (
    <div className="relative flex flex-col gap-3 overflow-hidden rounded-xl border border-border bg-card p-5 shadow-sm">
      <div className={`absolute top-0 left-0 right-0 h-1 ${icon_bg}`} />

      <div className="flex items-center gap-3">
        <div
          className={`flex h-9 w-9 items-center justify-center rounded-lg p-2 ${icon_bg} ${icon_color}`}
        >
          <Icon className="h-4 w-4" />
        </div>
        <p className="text-xs font-medium text-muted-foreground">{title}</p>
      </div>

      <div className="flex flex-col gap-0.5">
        <p className="text-2xl font-bold tracking-tight text-foreground">
          {value}
        </p>
        {subtext && <p className="text-xs text-muted-foreground">{subtext}</p>}
      </div>
    </div>
  );
}
