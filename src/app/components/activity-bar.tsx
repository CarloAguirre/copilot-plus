import {
  Files,
  Search,
  GitBranch,
  Bug,
  Sparkles,
  Package,
  User,
  Settings,
} from "lucide-react";

type Props = {
  active: string;
  onChange: (id: string) => void;
  onOpenSettings: () => void;
};

const items = [
  { id: "explorer", icon: Files, label: "Explorer" },
  { id: "search", icon: Search, label: "Search" },
  { id: "git", icon: GitBranch, label: "Source Control" },
  { id: "debug", icon: Bug, label: "Run & Debug" },
  { id: "ext", icon: Package, label: "Extensions" },
  { id: "ai", icon: Sparkles, label: "Nebula AI" },
];

export function ActivityBar({ active, onChange, onOpenSettings }: Props) {
  return (
    <div className="h-full flex flex-col items-center justify-between py-3 px-1.5 glass rounded-3xl">
      <div className="flex flex-col gap-1">
        {items.map((it) => {
          const isActive = it.id === active;
          return (
            <button
              key={it.id}
              onClick={() => onChange(it.id)}
              title={it.label}
              className={`relative w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                isActive
                  ? "bg-gradient-to-br from-violet-500/30 to-sky-500/30 text-white shadow-lg shadow-violet-500/20"
                  : "text-[var(--muted-fg)] hover:bg-white/5 hover:text-[var(--panel-fg)]"
              }`}
            >
              <it.icon size={17} />
              {isActive && (
                <span className="absolute -left-1.5 top-2 bottom-2 w-0.5 rounded-full bg-gradient-to-b from-violet-400 to-sky-400" />
              )}
            </button>
          );
        })}
      </div>
      <div className="flex flex-col gap-1">
        <button
          title="Account"
          className="w-10 h-10 rounded-xl flex items-center justify-center text-[var(--muted-fg)] hover:bg-white/5 hover:text-[var(--panel-fg)]"
        >
          <User size={16} />
        </button>
        <button
          title="Settings"
          onClick={onOpenSettings}
          className="w-10 h-10 rounded-xl flex items-center justify-center text-[var(--muted-fg)] hover:bg-white/5 hover:text-[var(--panel-fg)]"
        >
          <Settings size={16} />
        </button>
      </div>
    </div>
  );
}
