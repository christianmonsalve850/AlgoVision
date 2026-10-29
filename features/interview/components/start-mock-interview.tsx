"use client";

import { Video, Clock3, Clock6, Clock9, Clock12 } from "lucide-react";
import InterviewDifficulty from "@/features/interview/components/interview-difficulty";
import SelectDuration from "@/features/interview/components/select-duration";
import { useState } from "react";
import { Difficulty, Duration } from "@/features/interview/types";
import ReadyToStart from "@/features/interview/components/ready-to-start";

export default function StartMockInterview() {
  const [selectedDifficulty, setSelectedDifficulty] =
    useState<Difficulty>("Easy");
  const [selectedDuration, setSelectedDuration] =
    useState<Duration>(30);

  return (
    <div className="flex flex-col border border-border w-full rounded-lg p-6 gap-6">
      <div className="flex gap-4">
        <div className="w-12 h-12 flex items-center justify-center border border-border bg-muted rounded-lg text-foreground">
          <Video className="size-6" />
        </div>
        <div className="flex flex-col">
          <h2 className="text-xl font-bold tracking-tight text-foreground">
            Start Mock Interview
          </h2>
          <p className="text-sm text-muted-foreground">
            Configure your interview session
          </p>
        </div>
      </div>
      <div className="flex flex-col gap-4">
        <h2 className="text-xl font-semibold tracking-tight text-foreground">
          Select Difficulty
        </h2>
        <div className="flex gap-6">
          <InterviewDifficulty
            difficulty="Easy"
            subtext="1-2 easy problems, perfect for beginners"
            selectedDifficulty={selectedDifficulty}
            onSelectedDifficulty={() => setSelectedDifficulty("Easy")}
            difficultyColor="text-difficulty-easy-foreground"
          />
          <InterviewDifficulty
            difficulty="Medium"
            subtext="1-2 medium problems, standard interview level"
            selectedDifficulty={selectedDifficulty}
            onSelectedDifficulty={() => setSelectedDifficulty("Medium")}
            difficultyColor="text-difficulty-medium-foreground"
          />
          <InterviewDifficulty
            difficulty="Hard"
            subtext="1-2 hard problems, advanced interview level"
            selectedDifficulty={selectedDifficulty}
            onSelectedDifficulty={() => setSelectedDifficulty("Hard")}
            difficultyColor="text-difficulty-hard-foreground"
          />
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <h2 className="text-xl font-semibold tracking-tight text-foreground">
          Select Duration
        </h2>
        <div className="flex gap-6 w-full">
          <SelectDuration
            icon={Clock3}
            duration={15}
            selectedDuration={selectedDuration}
            onSelectedDuration={() => setSelectedDuration(15)}
          />
          <SelectDuration
            icon={Clock6}
            duration={30}
            selectedDuration={selectedDuration}
            onSelectedDuration={() => setSelectedDuration(30)}
          />
          <SelectDuration
            icon={Clock9}
            duration={45}
            selectedDuration={selectedDuration}
            onSelectedDuration={() => setSelectedDuration(45)}
          />
          <SelectDuration
            icon={Clock12}
            duration={60}
            selectedDuration={selectedDuration}
            onSelectedDuration={() => setSelectedDuration(60)}
          />
        </div>
      </div>
      <ReadyToStart difficulty={selectedDifficulty} duration={selectedDuration} />
    </div>
  );
}
