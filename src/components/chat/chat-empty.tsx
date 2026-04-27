"use client";

import { Bot, Sparkles } from "lucide-react";

const SUGGESTIONS = [
  "What can you help me with?",
  "Invite a team member",
  "Tell me about this organization",
];

type ChatEmptyProps = {
  onSuggestionClick: (suggestion: string) => void;
};

export function ChatEmpty({ onSuggestionClick }: ChatEmptyProps) {
  return (
    <div className="flex-1 flex items-center justify-center p-8">
      <div className="max-w-md w-full text-center space-y-8">
        <div className="mx-auto h-16 w-16 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center border border-primary/10">
          <Bot className="h-8 w-8 text-primary/70" />
        </div>

        <div className="space-y-2">
          <h2 className="text-xl font-semibold text-foreground">
            How can I help you?
          </h2>
          <p className="text-sm text-muted-foreground">
            Ask me anything about your organization or use the suggestions
            below.
          </p>
        </div>

        <div className="space-y-2">
          {SUGGESTIONS.map((suggestion) => (
            <button
              key={suggestion}
              onClick={() => onSuggestionClick(suggestion)}
              className="w-full text-left px-4 py-3 rounded-xl border border-border/40 bg-muted/20 hover:bg-muted/40 text-sm text-foreground transition-colors duration-150 flex items-center gap-3 group"
            >
              <Sparkles className="h-4 w-4 text-muted-foreground group-hover:text-primary/70 transition-colors shrink-0" />
              {suggestion}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
