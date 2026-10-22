import { useState } from "react";

interface Message {
  id: string;
  sender: "user" | "ai";
  text: string;
}

interface AIHintsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  problemTitle: string;
}

export function AIHintsDrawer({
  isOpen,
  onClose,
  problemTitle,
}: AIHintsDrawerProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      sender: "ai",
      text: `Hi! I'm your AI coding assistant for "${problemTitle}". Stuck or need a nudge? Ask me a question, but remember I won't write the code for you!`,
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Placeholder for sending user query to the AI backend
  const handleSendMessage = (textToSend?: string) => {
    const query = textToSend || inputValue;
    if (!query.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: "user",
      text: query,
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputValue("");
    setIsLoading(true);

    // TODO: Implement actual AI API call here with constraints (no full code output)
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        sender: "ai",
        text: `[Placeholder AI Hint]: That's a great question about ${problemTitle}. Think about how your two pointers move when comparing heights...`,
      };
      setMessages((prev) => [...prev, aiResponse]);
      setIsLoading(false);
    }, 1000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-96 bg-background border-l border-border shadow-2xl flex flex-col transition-transform duration-300 ease-in-out text-foreground">
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
          Suggested prompts:
        </p>
        <div className="flex flex-wrap gap-1.5">
          {[
            "Am I using the right pattern?",
            "Why is my time complexity high?",
            "Give me a hint without spoiling the code",
          ].map((chip, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(chip)}
              className="text-xs bg-background hover:bg-muted text-foreground px-2.5 py-1 rounded-full transition-colors border border-border"
            >
              {chip}
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
            className="bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-2 rounded-lg text-xs font-medium transition-colors"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
