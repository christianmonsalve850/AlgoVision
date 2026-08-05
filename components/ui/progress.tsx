import * as ProgressPrimitive from "@radix-ui/react-progress"

type ProgressProps = {
  value: number | string,
  bg?: string,
  color?: string,
  barHeight?: string
};

export function Progress({ value, bg, color, barHeight }: ProgressProps) {
  return (
    <ProgressPrimitive.Root
      className={`relative w-full overflow-hidden rounded-full ${barHeight ?? "h-2.5"} ${bg ?? "bg-primary/20"}`}
    >
      <ProgressPrimitive.Indicator
        className={`h-full w-full flex-1 transition-all duration-300 ${color ?? "bg-primary/80"}`}
        style={{ transform: `translateX(-${(100 - (Number(value) || 0))}%)` }}
      />
    </ProgressPrimitive.Root>
  )
}