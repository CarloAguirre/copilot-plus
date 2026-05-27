import { useEffect, useState } from "react";
import { Sparkles, X, ArrowRight } from "lucide-react";
import type { Tab } from "./editor-types";

const HINTS = [
  "Extract this JSX into a memoized component to avoid re-renders.",
  "You can replace this useEffect with a derived useMemo value.",
  "Consider adding a loading and error state to the fetch call.",
  "Type narrowing here would simplify the conditional below.",
  "This handler could be a useCallback for stable identity.",
];

export function AIHint({ tab }: { tab: Tab | null }) {
  const [open, setOpen] = useState(true);
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    setOpen(true);
    setIdx(Math.floor(Math.random() * HINTS.length));
  }, [tab?.id]);

  if (!tab || !open) return null;

  return (
    <div className="absolute bottom-3 right-3 z-10 max-w-xs">
      <div
        className="glass rounded-2xl p-3 pr-8 text-[12px] text-[var(--panel-fg)] relative"
        style={{ borderColor: "rgba(168,85,247,0.4)" }}
      >
        <div className="flex items-center gap-1.5 mb-1 text-[10.5px] uppercase tracking-[0.12em] text-violet-300">
          <Sparkles size={11} />
          AI Suggestion
        </div>
        <div className="leading-snug">{HINTS[idx]}</div>
        <div className="mt-2 flex items-center gap-1.5 text-[11px] text-sky-300 hover:text-sky-200 cursor-pointer">
          Apply <ArrowRight size={11} />
        </div>
        <button
          onClick={() => setOpen(false)}
          className="absolute top-2 right-2 p-1 rounded-full hover:bg-white/10 text-[var(--muted-fg)]"
        >
          <X size={12} />
        </button>
      </div>
    </div>
  );
}
