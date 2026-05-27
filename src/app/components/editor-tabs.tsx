import { X, Circle } from "lucide-react";
import type { Tab } from "./editor-types";

type Props = {
  tabs: Tab[];
  activeId: string | null;
  onSelect: (id: string) => void;
  onClose: (id: string) => void;
};

function langDot(lang: string) {
  if (lang === "tsx" || lang === "jsx") return "bg-cyan-400";
  if (lang === "ts" || lang === "js") return "bg-sky-400";
  if (lang === "py") return "bg-emerald-400";
  if (lang === "json") return "bg-amber-400";
  if (lang === "md") return "bg-blue-300";
  return "bg-zinc-400";
}

export function EditorTabs({ tabs, activeId, onSelect, onClose }: Props) {
  return (
    <div className="flex items-center gap-1 px-2 pt-2 pb-0 overflow-x-auto">
      {tabs.map((t) => {
        const active = t.id === activeId;
        return (
          <div
            key={t.id}
            onClick={() => onSelect(t.id)}
            className={`tab-pill group flex items-center gap-2 pl-3 pr-2 py-1.5 text-[12.5px] cursor-pointer shrink-0 transition-all
              ${
                active
                  ? "glass text-[var(--panel-fg)]"
                  : "text-[var(--muted-fg)] hover:text-[var(--panel-fg)] hover:bg-white/5 border border-transparent"
              }`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${langDot(t.language)}`} />
            <span className="tracking-tight">{t.name}</span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onClose(t.id);
              }}
              className="ml-1 p-0.5 rounded-full hover:bg-white/15"
              aria-label="Close"
            >
              {t.dirty ? (
                <Circle size={9} className="fill-current opacity-80" />
              ) : (
                <X size={11} />
              )}
            </button>
          </div>
        );
      })}
    </div>
  );
}
