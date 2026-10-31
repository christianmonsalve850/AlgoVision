"use client";

import { useEffect, useState } from "react";

type CountdownTimerProps = {
  initialTimeMinutes: number;
};

export default function CountdownTimer({
  initialTimeMinutes,
}: CountdownTimerProps) {
  if (!Number.isFinite(initialTimeMinutes) || initialTimeMinutes < 0) {
    throw new RangeError("initialTimeMinutes must be a non-negative number");
  }

  const initialTimeSeconds = Math.ceil(initialTimeMinutes * 60);
  const [remainingTimeSeconds, setRemainingTimeSeconds] =
    useState(initialTimeSeconds);

  useEffect(() => {
    const endTime = Date.now() + initialTimeSeconds * 1000;

    if (initialTimeSeconds === 0) return;

    const updateRemainingTime = () => {
      const nextRemainingTimeSeconds = Math.max(
        0,
        Math.ceil((endTime - Date.now()) / 1000)
      );
      setRemainingTimeSeconds(nextRemainingTimeSeconds);

      if (nextRemainingTimeSeconds === 0) {
        window.clearInterval(intervalId);
      }
    };

    const intervalId = window.setInterval(updateRemainingTime, 1000);
    updateRemainingTime();

    return () => window.clearInterval(intervalId);
  }, [initialTimeSeconds]);

  const minutes = Math.floor(remainingTimeSeconds / 60)
    .toString()
    .padStart(2, "0");
  const seconds = (remainingTimeSeconds % 60).toString().padStart(2, "0");

  return (
    <span
      role="timer"
      aria-label={`Time remaining: ${minutes}:${seconds}`}
      aria-live="off"
      className="w-[5ch] text-center text-xl font-bold tabular-nums"
    >
      {minutes}:{seconds}
    </span>
  );
}
