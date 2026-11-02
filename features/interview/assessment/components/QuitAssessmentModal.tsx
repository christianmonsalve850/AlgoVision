import { LogOut } from "lucide-react";
import { motion } from "motion/react";

interface QuitAssessmentModalProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  isSubmitting: boolean;
  error: string | null;
}

export default function QuitAssessmentModal({
  open,
  onCancel,
  onConfirm,
  isSubmitting,
  error,
}: QuitAssessmentModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-75 grid place-items-center bg-black/45 p-4 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, y: 10, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.16 }}
        className="w-full max-w-md rounded-xl border border-border bg-card p-6 shadow-2xl"
      >
        <div className="mb-5 grid size-11 place-items-center rounded-full bg-rose-500/10 text-rose-500">
          <LogOut className="size-5" />
        </div>
        <h2 className="mb-2 text-xl font-semibold tracking-tight">
          Are you sure you want to quit?
        </h2>
        <p className="text-sm leading-6 text-muted-foreground">
          Your current code will be saved, but this assessment attempt will be
          marked as abandoned. You won&apos;t be able to resume the timer
          afterward.
        </p>
        {error && (
          <p role="alert" className="mt-3 text-sm text-destructive">
            {error}
          </p>
        )}
        <div className="mt-6 flex justify-end gap-2">
          <button
            type="button"
            disabled={isSubmitting}
            onClick={onCancel}
            className="h-10 rounded-md px-4 text-sm transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-60"
          >
            Continue assessment
          </button>
          <button
            type="button"
            disabled={isSubmitting}
            onClick={onConfirm}
            className="inline-flex h-10 items-center gap-2 rounded-md bg-rose-600 px-4 text-sm font-semibold text-white transition-colors hover:bg-rose-500 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <LogOut className="size-4" />
            {isSubmitting ? "Quitting..." : "Quit assessment"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
