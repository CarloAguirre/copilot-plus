import { useMemo } from "react";
import type { Tab } from "./editor-types";

export function Minimap({ tab }: { tab: Tab | null }) {
  const lines = useMemo(() => tab?.content.split("\n") ?? [], [tab?.content]);
  if (!tab) return null;
  return (
    <div
      className="hidden lg:flex flex-col gap-[1px] py-3 px-2 border-l border-[var(--border)] select-none overflow-hidden shrink-0"
      style={{ width: 78 }}
      aria-hidden
    >
      {lines.slice(0, 220).map((line, i) => {
        const len = Math.min(line.length, 60);
        const indent = line.match(/^\s*/)?.[0].length ?? 0;
        const isComment = /^\s*(\/\/|#)/.test(line);
        const isKw = /\b(function|const|class|def|import|return|if|for)\b/.test(
          line,
        );
        const color = isComment
          ? "rgba(235,235,245,0.18)"
          : isKw
            ? "rgba(196,181,253,0.55)"
            : "rgba(235,235,245,0.32)";
        return (
          <div
            key={i}
            style={{
              marginLeft: Math.min(indent * 1.2, 24),
              width: Math.max(2, len),
              height: 2,
              background: color,
              borderRadius: 1,
            }}
          />
        );
      })}
    </div>
  );
}
