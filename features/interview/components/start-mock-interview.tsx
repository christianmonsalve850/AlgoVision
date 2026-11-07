"use client";

import { Video, Clock3, Clock6, Clock9, Clock12, Shuffle } from "lucide-react";
import InterviewDifficulty from "@/features/interview/components/interview-difficulty";
import SelectDuration from "@/features/interview/components/select-duration";
import { useState } from "react";
import type { Difficulty, Duration } from "@/features/interview/types";
import ReadyToStart from "@/features/interview/components/ready-to-start";
import ProblemCountSelector from "@/features/interview/components/problem-count-selector";
import InterviewLanguageSelector from "@/features/interview/components/interview-language-selector";
import type { SupportedLanguage } from "@/features/code-editor/languages";

export default function StartMockInterview() {
  const [selectedDifficulties, setSelectedDifficulties] =
    useState<Difficulty[]>(["Easy"]);
  const [selectedDuration, setSelectedDuration] =
    useState<Duration>(30);
  const [problemCount, setProblemCount] = useState(2);
  const [selectedLanguage, setSelectedLanguage] =
    useState<SupportedLanguage>("Python");

  const toggleDifficulty = (difficulty: Difficulty) => {
    setSelectedDifficulties((current) =>
      current.includes(difficulty)
        ? current.filter((selected) => selected !== difficulty)
        : [...current, difficulty],
    );
  };

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
        <p className="-mt-2 text-sm text-muted-foreground">
          Choose one or more difficulties, or let us choose randomly.
        </p>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <button
            type="button"
            aria-pressed={selectedDifficulties.length === 0}
            className={`flex flex-col gap-2 rounded-lg border-2 bg-background p-5 text-start ${
              selectedDifficulties.length === 0
                ? "border-foreground"
                : "border-border"
            }`}
            onClick={() => setSelectedDifficulties([])}
          >
            <h2 className="flex items-center gap-2 text-xl font-semibold tracking-tight text-foreground">
              <Shuffle className="size-5" />
              Random
            </h2>
            <p className="text-sm text-muted-foreground">
              Problems can be any difficulty
            </p>
          </button>
          <InterviewDifficulty
            difficulty="Easy"
            subtext="1-2 easy problems, perfect for beginners"
            isSelected={selectedDifficulties.includes("Easy")}
            onSelectedDifficulty={() => toggleDifficulty("Easy")}
            difficultyColor="text-difficulty-easy-foreground"
          />
          <InterviewDifficulty
            difficulty="Medium"
            subtext="1-2 medium problems, standard interview level"
            isSelected={selectedDifficulties.includes("Medium")}
            onSelectedDifficulty={() => toggleDifficulty("Medium")}
            difficultyColor="text-difficulty-medium-foreground"
          />
          <InterviewDifficulty
            difficulty="Hard"
            subtext="1-2 hard problems, advanced interview level"
            isSelected={selectedDifficulties.includes("Hard")}
            onSelectedDifficulty={() => toggleDifficulty("Hard")}
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
      <div className="flex flex-col gap-4">
        <div>
          <h2 className="text-xl font-semibold tracking-tight text-foreground">
            Select Language
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Your language will be locked once the assessment starts.
          </p>
        </div>
        <InterviewLanguageSelector
          language={selectedLanguage}
          onLanguageChange={setSelectedLanguage}
        />
      </div>
      <ProblemCountSelector
        minProblems={1}
        maxProblems={3}
        value={problemCount}
        onValueChange={setProblemCount}
      />
      <ReadyToStart
        difficulties={selectedDifficulties}
        duration={selectedDuration}
        problemCount={problemCount}
        language={selectedLanguage}
      />
    </div>
  );
}
