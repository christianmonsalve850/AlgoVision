"use client";

import { useEffect, useState } from "react";

type CountdownTimerProps = {
  initialTimeMinutes: number;
  sessionStartDate: string;
};

export default function CountdownTimer({
  initialTimeMinutes,
  sessionStartDate,
}: CountdownTimerProps) {
  if (!Number.isFinite(initialTimeMinutes) || initialTimeMinutes < 0) {
    throw new RangeError("initialTimeMinutes must be a non-negative number");
  }

  const initialTimeSeconds = Math.ceil(initialTimeMinutes * 60);
  const sessionStartTime = Date.parse(sessionStartDate);

  if (!Number.isFinite(sessionStartTime)) {
    throw new RangeError("sessionStartDate must be a valid date string");
  }

  const [remainingTimeSeconds, setRemainingTimeSeconds] =
    useState(initialTimeSeconds);
  const endTime = sessionStartTime + initialTimeSeconds * 1000;

  useEffect(() => {
    const updateRemainingTime = () => {
      const nextRemainingTimeSeconds = Math.max(
        0,
        Math.ceil((endTime - Date.now()) / 1000),
      );
      setRemainingTimeSeconds(nextRemainingTimeSeconds);

      if (nextRemainingTimeSeconds === 0) {
        if (intervalId !== undefined) {
          window.clearInterval(intervalId);
        }
      }
    };

    const timeoutId = window.setTimeout(updateRemainingTime, 0);
    const intervalId =
      initialTimeSeconds > 0 && endTime > Date.now()
        ? window.setInterval(updateRemainingTime, 1000)
        : undefined;

    return () => {
      window.clearTimeout(timeoutId);
      if (intervalId !== undefined) {
        window.clearInterval(intervalId);
      }
    };
  }, [endTime, initialTimeSeconds]);

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
