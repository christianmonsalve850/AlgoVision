import React from 'react';
import { 
  CheckCircle2, 
  Info, 
  AlertTriangle, 
  XCircle 
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
    Icon: React.ElementType;
  }
> = {
  success: {
    border: 'border-emerald-500/30',
    bg: 'bg-emerald-950/20',
    iconColor: 'text-emerald-400',
    Icon: CheckCircle2,
  },
  info: {
    border: 'border-neutral-700',
    bg: 'bg-neutral-900/60',
    iconColor: 'text-neutral-400',
    Icon: Info,
  },
  warning: {
    border: 'border-amber-500/30',
    bg: 'bg-amber-950/20',
    iconColor: 'text-amber-400',
    Icon: AlertTriangle,
  },
  danger: {
    border: 'border-rose-500/30',
    bg: 'bg-rose-950/20',
    iconColor: 'text-rose-400',
    Icon: XCircle,
  },
};

export const Callout: React.FC<CalloutProps> = ({
  type = 'info',
  children,
}) => {
  const { border, bg, iconColor, Icon } = variantStyles[type] || variantStyles.info;

  return (
    <div
      className={`my-5 flex items-start gap-3 rounded-xl border ${border} ${bg} p-4 text-sm text-neutral-300 shadow-sm`}
    >
      <Icon className={`mt-0.5 h-5 w-5 flex-shrink-0 ${iconColor}`} />
      <div className="leading-relaxed [&>p]:m-0">{children}</div>
    </div>
  );
};

export default Callout;