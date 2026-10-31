"use client";

import { useState } from "react";
import { Group, Panel, Separator } from "react-resizable-panels";
type ProblemTab = "description" | "guidelines";

export default function AssessmentBody() {
  const [problemTab, setProblemTab] = useState<ProblemTab>("description");
  return (
    <section className="flex h-full min-h-0 flex-1">
      <Group
        orientation="horizontal"
        defaultLayout={{ "assessment-details": 40, "assessment-editor": 60 }}
        className="h-full min-h-0 flex-1"
      >
        <Panel
          id="assessment-details"
          defaultSize={40}
          minSize="25%"
          maxSize="65%"
          className="flex min-h-0 min-w-0 flex-col overflow-hidden"
        >
          <div className="flex h-12 shrink-0 items-stretch gap-4 border-b border-border px-6">
            <button
              type="button"
              className={`relative h-full text-sm font-semibold capitalize ${problemTab === "description" ? "text-foreground" : "text-muted-foreground hover:text-foreground"}`}
              onClick={() => setProblemTab("description")}
            >  
              Description
              {problemTab === "description" && <span className="absolute inset-x-0 bottom-0 h-0.5 bg-foreground" />}
            </button>
            <button
              type="button"
              className={`relative h-full text-sm font-semibold capitalize ${problemTab === "guidelines" ? "text-foreground" : "text-muted-foreground hover:text-foreground"}`}
              onClick={() => setProblemTab("guidelines")}
            >
              Guidelines
              {problemTab === "guidelines" && <span className="absolute inset-x-0 bottom-0 h-0.5 bg-foreground" />}
            </button>
          </div>
          <div className="min-h-0 flex-1 overflow-auto" />
        </Panel>

        <Separator className="group relative flex w-2 self-stretch items-center justify-center border-x border-border bg-transparent transition-colors hover:bg-muted/40 active:bg-muted/60">
          <div className="h-8 w-1 rounded-full bg-border/60 transition-colors group-hover:bg-emerald-400 group-active:bg-emerald-500" />
        </Separator>

        <Panel
          id="assessment-editor"
          defaultSize={60}
          minSize="35%"
          className="min-h-0 min-w-0 overflow-hidden"
        />
      </Group>
    </section>
  );
}
