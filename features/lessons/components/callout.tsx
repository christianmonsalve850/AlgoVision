import React from 'react';
import {
  CheckCircle2,
  Info,
  AlertTriangle,
  XCircle,
} from 'lucide-react';

export type CalloutType = 'success' | 'info' | 'warning' | 'danger';

interface CalloutProps {
  type?: CalloutType;
  children: React.ReactNode;
}

const variantStyles: Record<
  CalloutType,
  {
    border: string;
    bg: string;
    iconColor: string;
    textColor: string;
    Icon: React.ElementType;
  }
> = {
  success: {
    border: 'border-emerald-500/20',
    bg: 'bg-emerald-500/10',
    iconColor: 'text-emerald-600 dark:text-emerald-300',
    textColor: 'text-emerald-600 dark:text-emerald-300',
    Icon: CheckCircle2,
  },
  info: {
    border: 'border-border',
    bg: 'bg-card/90',
    iconColor: 'text-muted-foreground',
    textColor: 'text-foreground',
    Icon: Info,
  },
  warning: {
    border: 'border-amber-500/25',
    bg: 'bg-amber-500/10',
    iconColor: 'text-amber-700',
    textColor: 'text-amber-900',
    Icon: AlertTriangle,
  },
  danger: {
    border: 'border-destructive/25',
    bg: 'bg-destructive/10',
    iconColor: 'text-destructive',
    textColor: 'text-destructive',
    Icon: XCircle,
  },
};

export const Callout: React.FC<CalloutProps> = ({
  type = 'info',
  children,
}) => {
  const { border, bg, iconColor, textColor, Icon } = variantStyles[type] || variantStyles.info;

  return (
    <div className={`my-5 flex items-start gap-3 rounded-xl border ${border} ${bg} p-4 text-sm shadow-sm ${textColor}`}>
      <Icon className={`mt-0.5 h-5 w-5 shrink-0 ${iconColor}`} />
      <div className="leading-relaxed [&>p]:m-0">{children}</div>
    </div>
  );
};

export default Callout;