"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, XCircle } from "lucide-react";

interface SubmissionOverlayProps {
  status: "success" | "failure" | null;
  onClose: () => void;
  durationMs?: number; // Optional duration, default 2000ms
}

export function SubmissionOverlay({
  status,
  onClose,
  durationMs = 2000,
}: SubmissionOverlayProps) {
  useEffect(() => {
    if (!status) return;

    // Automatically trigger onClose after durationMs
    const timer = setTimeout(() => {
      onClose();
    }, durationMs);

    // Cleanup timer if component unmounts or status changes before timeout
    return () => clearTimeout(timer);
  }, [status, durationMs, onClose]);

  return (
    <AnimatePresence>
      {status && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="flex flex-col items-center gap-3 rounded-2xl bg-card p-8 shadow-2xl border border-border"
          >
            {status === "success" ? (
              <>
                <CheckCircle2 className="size-16 text-emerald-500 animate-bounce" />
                <p className="text-lg font-semibold text-emerald-500">Accepted</p>
              </>
            ) : (
              <>
                <XCircle className="size-16 text-destructive animate-pulse" />
                <p className="text-lg font-semibold text-destructive">Wrong Answer</p>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}