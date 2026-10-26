import { useRef, useState } from "react";
import { Group, Panel, Separator } from "react-resizable-panels";
import type { ProblemRecord } from "@/features/practice/problem-page/problem/types";
import { requestAiHint } from "@/features/practice/problem-page/services/request-ai-hint";
import type { HintType } from "@/app/types/api-types";

const hintCategoryLabels: Record<HintType, string> = {
  pattern: "Pattern",
  complexity: "Complexity",
  data_structure: "Data Structure",
};

const quickHintRequests: {
  label: string;
  requestedHintType?: HintType;
  query?: string;
  requiresSubmission?: boolean;
}[] = [
  { label: "Pattern", requestedHintType: "pattern" },
  { label: "Complexity", requestedHintType: "complexity" },
  { label: "Data Structure", requestedHintType: "data_structure" },
  { label: "General", query: "Give me a general hint to help me make progress." },
];

interface Message {
  id: string;
  sender: "user" | "ai";
  text: string;
}

interface AIHintsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  problemId: string;
  problem: ProblemRecord;
  userCode: string;
  executionId: string | null;
}

export function AIHintsDrawer({
  isOpen,
  onClose,
  problemId,
  problem,
  userCode,
  executionId,
}: AIHintsDrawerProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      sender: "ai",
      text: `Hi! I'm your AI coding assistant for "${problem.title}". Stuck or need a nudge? Ask me a question, but remember I won't write the code for you!`,
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messageIdCounter = useRef(1);

  const getNextMessageId = () => {
    messageIdCounter.current += 1;
    return messageIdCounter.current.toString();
  };

  const handleSendMessage = async (
    textToSend?: string,
    requestedHintType: HintType | null = null,
    requiresSubmission = false,
  ) => {
    const query = (textToSend ?? inputValue).trim();
    if ((!query && !requestedHintType) || isLoading) return;

    if (requiresSubmission && !executionId) {
      const responseId = getNextMessageId();
      setMessages((prev) => [
        ...prev,
        {
          id: responseId,
          sender: "ai",
          text: "Submit your code first so I can give a hint based on its failed tests.",
        },
      ]);
      return;
    }

    const userMsg: Message = {
      id: getNextMessageId(),
      sender: "user",
      text: query || (requestedHintType ? hintCategoryLabels[requestedHintType] : ""),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputValue("");
    setIsLoading(true);
    try {
      const result = await requestAiHint({
        query,
        problemId,
        problem: {
          title: problem.title,
          description: problem.description,
          constraints: problem.constraints,
        },
        userCode,
        executionId,
        requestedHintType,
      });
      const responseId = getNextMessageId();
      setMessages((prev) => [
        ...prev,
        {
          id: responseId,
          sender: "ai",
          text: result?.hint ?? "I couldn't generate a hint just now. Please try again.",
        },
      ]);
    } catch {
      const responseId = getNextMessageId();
      setMessages((prev) => [
        ...prev,
        {
          id: responseId,
          sender: "ai",
          text: "I couldn't reach the hint service. Please try again in a moment.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <Group
      orientation="horizontal"
      defaultLayout={{ "drawer-spacer": 70, "ai-hints-drawer": 30 }}
      className="pointer-events-none fixed inset-0 z-50"
    >
      <Panel
        id="drawer-spacer"
        defaultSize="70%"
        className="pointer-events-none"
      />
      <Separator className="group pointer-events-auto relative z-10 flex w-2 cursor-col-resize items-center justify-center border-l border-border/60 bg-transparent transition-colors hover:bg-muted/40 active:bg-muted/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-emerald-500">
        <div className="h-8 w-1 rounded-full bg-border/60 transition-colors group-hover:bg-emerald-400/70 group-active:bg-emerald-500" />
      </Separator>
      <Panel
        id="ai-hints-drawer"
        defaultSize="30%"
        minSize={280}
        maxSize={640}
        className="pointer-events-auto min-w-0"
      >
        <div className="flex h-full flex-col border-l border-border bg-background text-foreground shadow-2xl">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-background">
            <div className="flex items-center space-x-2">
              <span>✨</span>
              <h2 className="text-sm font-semibold tracking-wide">
                AI Hint Assistant
              </h2>
            </div>
            <button
              onClick={onClose}
              className="text-foreground hover:text-muted-foreground p-1 rounded-md transition-colors"
              aria-label="Close AI Hints"
            >
              ✕
            </button>
          </div>

          {/* Quick Prompt Chips */}
          <div className="p-3 border-b border-border bg-background">
            <p className="text-[11px] font-medium text-foreground mb-2">
              Request a hint category:
            </p>
            <div className="flex flex-col gap-1.5 items-start">
              {quickHintRequests.map((hintRequest) => (
                <button
                  key={hintRequest.label}
                  onClick={() =>
                    handleSendMessage(
                      hintRequest.query,
                      hintRequest.requestedHintType ?? null,
                      hintRequest.requiresSubmission,
                    )
                  }
                  className="text-xs bg-background hover:bg-muted text-foreground px-3 py-1 rounded-full transition-colors border border-border"
                >
                  {hintRequest.label}
                </button>
              ))}
            </div>
          </div>

          {/* Chat Messages Feed */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${
                  msg.sender === "user" ? "items-end" : "items-start"
                }`}
              >
                <div
                  className={`max-w-[85%] rounded-lg p-3 text-xs leading-relaxed ${
                    msg.sender === "user"
                      ? "bg-emerald-700 text-white rounded-br-none"
                      : "bg-muted text-foreground border border-border rounded-bl-none"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex items-center space-x-2 text-xs text-zinc-400 bg-zinc-800/50 p-3 rounded-lg w-max border border-zinc-800">
                <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce" />
                <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce [animation-delay:0.2s]" />
                <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce [animation-delay:0.4s]" />
                <span>Thinking...</span>
              </div>
            )}
          </div>

          {/* Input Bar */}
          <div className="p-3 border-t border-border bg-background">
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                placeholder="Ask for a nudge or hint..."
                className="flex-1 bg-muted border border-border rounded-lg px-3 py-2 text-xs text-foreground placeholder-zinc-500 focus:outline-none focus:border-emerald-500"
              />
              <button
                onClick={() => handleSendMessage()}
                disabled={isLoading || !inputValue.trim()}
                className="bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-2 rounded-lg text-xs font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      </Panel>
    </Group>
  );
}
