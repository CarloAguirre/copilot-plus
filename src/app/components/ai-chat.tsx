import { useEffect, useRef, useState } from "react";
import { Sparkles, Send, Bot, User, Bug, Lightbulb, Wand2 } from "lucide-react";
import type { ChatMsg, Tab } from "./editor-types";
import { aiCannedReplies, fallbackReply } from "./mock-data";

type Props = {
  activeTab: Tab | null;
};

const initialMsgs: ChatMsg[] = [
  {
    id: "m0",
    role: "ai",
    kind: "text",
    text: "Hi! I'm Nebula AI. I can suggest completions, debug, and explain code in your active file. Try a prompt below 👇",
  },
];

const quickPrompts = [
  { label: "Explain this file", icon: Sparkles, prompt: "Explain this file" },
  { label: "Find bugs", icon: Bug, prompt: "Find bugs in this code" },
  { label: "Optimize", icon: Lightbulb, prompt: "Optimize this for performance" },
  { label: "Complete", icon: Wand2, prompt: "Complete the next function" },
];

function craftReply(prompt: string, tab: Tab | null): ChatMsg {
  const found = aiCannedReplies.find((r) => r.match.test(prompt));
  const ctx = tab ? `\n\n→ Context: ${tab.name} (${tab.language})` : "";
  if (found) {
    return {
      id: crypto.randomUUID(),
      role: "ai",
      kind: found.kind,
      text: found.reply + ctx,
    };
  }
  return {
    id: crypto.randomUUID(),
    role: "ai",
    kind: "text",
    text: fallbackReply + ctx,
  };
}

const kindBadge: Record<string, { label: string; cls: string }> = {
  suggestion: { label: "Suggestion", cls: "bg-blue-500/20 text-blue-300" },
  debug: { label: "Debug Hint", cls: "bg-rose-500/20 text-rose-300" },
  completion: { label: "Completion", cls: "bg-emerald-500/20 text-emerald-300" },
  text: { label: "Assistant", cls: "bg-violet-500/20 text-violet-300" },
};

export function AIChat({ activeTab }: Props) {
  const [msgs, setMsgs] = useState<ChatMsg[]>(initialMsgs);
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [msgs, thinking]);

  const send = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    const userMsg: ChatMsg = {
      id: crypto.randomUUID(),
      role: "user",
      text: trimmed,
    };
    setMsgs((m) => [...m, userMsg]);
    setInput("");
    setThinking(true);
    setTimeout(() => {
      setMsgs((m) => [...m, craftReply(trimmed, activeTab)]);
      setThinking(false);
    }, 700 + Math.random() * 600);
  };

  return (
    <div className="h-full flex flex-col glass text-[var(--panel-fg)] rounded-3xl overflow-hidden">
      <div className="flex items-center gap-2 px-3 py-2.5 border-b border-[var(--border)] text-[11px] uppercase tracking-[0.12em] text-[var(--muted-fg)]">
        <Sparkles size={13} className="text-violet-400" />
        <span>Nebula AI</span>
        {activeTab && (
          <span className="normal-case tracking-normal text-[10.5px] px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-[var(--panel-fg)]">
            @ {activeTab.name}
          </span>
        )}
        <span className="ml-auto flex items-center gap-1 text-[10px] normal-case tracking-normal px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-400/20">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          online
        </span>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-3 space-y-3">
        {msgs.map((m) => (
          <div
            key={m.id}
            className={`flex gap-2 ${m.role === "user" ? "justify-end" : ""}`}
          >
            {m.role === "ai" && (
              <div className="w-7 h-7 rounded-full bg-violet-500/20 flex items-center justify-center shrink-0">
                <Bot size={14} className="text-violet-300" />
              </div>
            )}
            <div
              className={`max-w-[85%] rounded-lg px-3 py-2 text-[13px] whitespace-pre-wrap break-words ${
                m.role === "user"
                  ? "bg-blue-600 text-white"
                  : "bg-[var(--editor-bg)] border border-[var(--border)]"
              }`}
            >
              {m.role === "ai" && m.kind && (
                <div
                  className={`inline-block mb-1 text-[10px] px-1.5 py-0.5 rounded ${kindBadge[m.kind].cls}`}
                >
                  {kindBadge[m.kind].label}
                </div>
              )}
              <div>{m.text}</div>
            </div>
            {m.role === "user" && (
              <div className="w-7 h-7 rounded-full bg-blue-500/20 flex items-center justify-center shrink-0">
                <User size={14} className="text-blue-300" />
              </div>
            )}
          </div>
        ))}
        {thinking && (
          <div className="flex gap-2">
            <div className="w-7 h-7 rounded-full bg-violet-500/20 flex items-center justify-center">
              <Bot size={14} className="text-violet-300" />
            </div>
            <div className="bg-[var(--editor-bg)] border border-[var(--border)] rounded-lg px-3 py-2 flex gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-bounce" />
              <span
                className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-bounce"
                style={{ animationDelay: "0.15s" }}
              />
              <span
                className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-bounce"
                style={{ animationDelay: "0.3s" }}
              />
            </div>
          </div>
        )}
      </div>

      <div className="px-3 py-2 border-t border-[var(--border)] flex flex-wrap gap-1.5">
        {quickPrompts.map((q) => (
          <button
            key={q.label}
            onClick={() => send(q.prompt)}
            className="flex items-center gap-1 px-2 py-1 rounded-md bg-[var(--editor-bg)] border border-[var(--border)] text-[11px] hover:bg-[var(--hover-bg)]"
          >
            <q.icon size={11} />
            {q.label}
          </button>
        ))}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          send(input);
        }}
        className="p-3 border-t border-[var(--border)] flex gap-2"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask Nebula AI..."
          className="flex-1 bg-[var(--editor-bg)] border border-[var(--border)] rounded-md px-3 py-2 text-[13px] outline-none focus:border-violet-400"
        />
        <button
          type="submit"
          className="px-3 py-2 rounded-md bg-violet-500 hover:bg-violet-600 text-white"
        >
          <Send size={14} />
        </button>
      </form>
    </div>
  );
}
