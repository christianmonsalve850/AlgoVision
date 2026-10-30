import { SelectDurationProps } from "@/features/interview/types";

export default function SelectDuration({
  icon: Icon,
  duration,
  selectedDuration,
  onSelectedDuration,
}: SelectDurationProps) {
  return (
    <button
      className={`flex flex-col flex-1 border-2 bg-background rounded-lg p-5 gap-2 items-center justify-center ${
        selectedDuration === duration ? "border-foreground" : "border-border"
      }`}
      onClick={onSelectedDuration}
    >
      <Icon
        className={`size-6 ${
          selectedDuration === duration
            ? "text-foreground"
            : "text-muted-foreground"
        }`}
      />
      <p className="text-foreground font-semibold">{duration}m</p>
    </button>
  );
}
