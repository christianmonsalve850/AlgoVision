import * as ProgressPrimitive from "@radix-ui/react-progress"

type ProgressProps = {
    value: any;
};

export function Progress({ value }: ProgressProps) {
  return (
    <ProgressPrimitive.Root 
      className="relative h-2 w-full overflow-hidden rounded-full bg-slate-800"
    >
      <ProgressPrimitive.Indicator
        className="h-full w-full flex-1 bg-sky-500 transition-all duration-300"
        style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
      />
    </ProgressPrimitive.Root>
  )
}