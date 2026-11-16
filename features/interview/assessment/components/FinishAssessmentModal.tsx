import { motion } from "motion/react";

interface FinishAssessmentModalProps {
  open: boolean;
  problemCount: number;
  onCancel: () => void;
  onConfirm: () => void;
}

export default function FinishAssessmentModal({
  open,
  problemCount,
  onCancel,
  onConfirm,
}: FinishAssessmentModalProps) {
  if (!open) return null;

  const remainingLabel =
    problemCount === 1 ? "1 unsubmitted problem" : `${problemCount} unsubmitted problems`;

  return (
    <div className="fixed inset-0 z-75 grid place-items-center bg-black/45 p-4 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, y: 10, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.16 }}
        role="dialog"
        aria-modal="true"
        aria-labelledby="finish-assessment-title"
        className="w-full max-w-md rounded-xl border border-border bg-card p-6 shadow-2xl"
      >
        <h2
          id="finish-assessment-title"
          className="mb-2 text-xl font-semibold tracking-tight"
        >
          Are you sure you want to finish?
        </h2>
        <p className="text-sm leading-6 text-muted-foreground">
          You have {remainingLabel} remaining.
        </p>
        <div className="mt-6 flex justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="h-10 rounded-md px-4 text-sm transition-colors hover:bg-muted"
          >
            Continue assessment
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="h-10 rounded-md bg-emerald-600 px-4 text-sm font-semibold text-white transition-colors hover:bg-emerald-500"
          >
            Finish Assessment
          </button>
        </div>
      </motion.div>
    </div>
  );
}
