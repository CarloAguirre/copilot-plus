import { ChevronRight, Sparkles } from "lucide-react";
import type { Tab } from "./editor-types";

export function Breadcrumb({ tab }: { tab: Tab | null }) {
  if (!tab) return null;
  const parts =
    tab.id === "f-app"
      ? ["src", "app", tab.name]
      : tab.id === "f-button" || tab.id === "f-card"
        ? ["src", "components", tab.name]
        : tab.id === "f-client"
          ? ["src", "api", tab.name]
          : tab.id === "f-utils"
            ? ["src", tab.name]
            : [tab.name];

  const symbols = inferSymbols(tab);

  return (
    <div className="flex items-center gap-1.5 px-4 py-1.5 text-[11.5px] text-[var(--muted-fg)] border-b border-[var(--border)]">
      {parts.map((p, i) => (
        <span key={i} className="flex items-center gap-1.5">
          {i > 0 && <ChevronRight size={11} className="opacity-50" />}
          <span
            className={
              i === parts.length - 1
                ? "text-[var(--panel-fg)]"
                : "hover:text-[var(--panel-fg)] cursor-pointer"
            }
          >
            {p}
          </span>
        </span>
      ))}
      {symbols.length > 0 && (
        <>
          <ChevronRight size={11} className="opacity-50" />
          <span className="text-violet-300">{symbols[0]}</span>
        </>
      )}
      <div className="ml-auto flex items-center gap-1.5 text-[10.5px]">
        <Sparkles size={10} className="text-violet-300" />
        <span>AI ready</span>
      </div>
    </div>
  );
}

function inferSymbols(tab: Tab): string[] {
  const out: string[] = [];
  const re = /(?:function|const|class|def)\s+([A-Za-z_$][\w$]*)/g;
  let m;
  while ((m = re.exec(tab.content)) !== null) out.push(m[1]);
  return out;
}
