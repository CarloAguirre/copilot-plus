import { useEffect, useRef } from "react";
import type { Tab } from "./editor-types";
import { HighlightedCode } from "./syntax-highlight";

type Props = {
  tab: Tab | null;
  onChange: (content: string) => void;
};

export function CodeEditor({ tab, onChange }: Props) {
  const taRef = useRef<HTMLTextAreaElement>(null);
  const preRef = useRef<HTMLDivElement>(null);
  const gutterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (taRef.current) taRef.current.scrollTop = 0;
  }, [tab?.id]);

  if (!tab) {
    return (
      <div className="h-full flex items-center justify-center text-[var(--muted-fg)] p-8">
        <div className="text-center max-w-sm">
          <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-violet-500 via-fuchsia-500 to-sky-400 flex items-center justify-center shadow-2xl shadow-violet-500/30">
            <span className="text-white text-xl">✨</span>
          </div>
          <div className="text-xl tracking-tight mb-1 text-[var(--panel-fg)]">
            Welcome to Nebula Code
          </div>
          <div className="text-[13px] mb-6">
            A glassy, AI-native editor. Open a file or start a new conversation.
          </div>
          <div className="grid grid-cols-2 gap-2 text-left">
            {[
              ["⌘ B", "Toggle Explorer"],
              ["⌘ J", "Toggle Console"],
              ["⌘ L", "Toggle AI"],
              ["⌘ K", "All Shortcuts"],
            ].map(([k, v]) => (
              <div
                key={k}
                className="flex items-center justify-between px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-[11.5px]"
              >
                <span>{v}</span>
                <kbd className="mono text-[10px] px-1.5 py-0.5 rounded-md bg-white/10 border border-white/10">
                  {k}
                </kbd>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const lines = tab.content.split("\n");

  const handleScroll = () => {
    if (taRef.current && preRef.current && gutterRef.current) {
      preRef.current.scrollTop = taRef.current.scrollTop;
      preRef.current.scrollLeft = taRef.current.scrollLeft;
      gutterRef.current.scrollTop = taRef.current.scrollTop;
    }
  };

  return (
    <div className="h-full flex relative overflow-hidden mono text-[13px] leading-[1.6]">
      <div
        ref={gutterRef}
        className="overflow-hidden text-right py-3 pl-3 pr-2 text-[var(--gutter-fg)] select-none bg-[var(--editor-bg)] border-r border-[var(--border)]"
        style={{ minWidth: 48 }}
      >
        {lines.map((_, i) => (
          <div key={i} className="leading-[1.5]">
            {i + 1}
          </div>
        ))}
      </div>
      <div className="relative flex-1 overflow-hidden">
        <div
          ref={preRef}
          aria-hidden
          className="absolute inset-0 overflow-auto py-3 px-3 pointer-events-none"
        >
          <HighlightedCode code={tab.content} language={tab.language} />
        </div>
        <textarea
          ref={taRef}
          spellCheck={false}
          value={tab.content}
          onChange={(e) => onChange(e.target.value)}
          onScroll={handleScroll}
          className="absolute inset-0 w-full h-full resize-none py-3 px-3 bg-transparent text-transparent caret-[var(--ed-fg)] outline-none font-mono text-[13px] leading-[1.5] whitespace-pre overflow-auto selection:bg-blue-500/30"
          style={{ tabSize: 2 }}
        />
      </div>
    </div>
  );
}
