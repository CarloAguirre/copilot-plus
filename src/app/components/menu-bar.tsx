import { useEffect, useRef, useState } from "react";
import {
  Files,
  Search,
  GitBranch,
  Sparkles,
  Settings,
  Sun,
  Moon,
  Keyboard,
  Bug,
  Play,
  FilePlus,
  FolderPlus,
  Save,
  Scissors,
  Copy,
  ClipboardPaste,
  Undo2,
  Redo2,
  Eye,
  EyeOff,
  Terminal,
  PanelLeft,
  Info,
  HelpCircle,
  Zap,
  ArrowRight,
} from "lucide-react";

type MenuItem =
  | { kind: "item"; label: string; shortcut?: string; icon?: any; onClick?: () => void }
  | { kind: "sep" };

type Props = {
  theme: "dark" | "light";
  onToggleTheme: () => void;
  onShortcuts: () => void;
  showExplorer: boolean;
  showAI: boolean;
  showConsole: boolean;
  onToggleExplorer: () => void;
  onToggleAI: () => void;
  onToggleConsole: () => void;
  onRun: () => void;
  onOpenSettings: () => void;
};

export function MenuBar(props: Props) {
  const {
    theme,
    onToggleTheme,
    onShortcuts,
    showExplorer,
    showAI,
    showConsole,
    onToggleExplorer,
    onToggleAI,
    onToggleConsole,
    onRun,
    onOpenSettings,
  } = props;

  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpenMenu(null);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  const menus: Record<string, MenuItem[]> = {
    File: [
      { kind: "item", label: "New File", icon: FilePlus, shortcut: "⌘ N" },
      { kind: "item", label: "New Folder", icon: FolderPlus, shortcut: "⌘ ⇧ N" },
      { kind: "sep" },
      { kind: "item", label: "Save", icon: Save, shortcut: "⌘ S" },
      { kind: "item", label: "Save All", icon: Save, shortcut: "⌘ ⇧ S" },
      { kind: "sep" },
      { kind: "item", label: "Close Tab", shortcut: "⌘ W" },
    ],
    Edit: [
      { kind: "item", label: "Undo", icon: Undo2, shortcut: "⌘ Z" },
      { kind: "item", label: "Redo", icon: Redo2, shortcut: "⌘ ⇧ Z" },
      { kind: "sep" },
      { kind: "item", label: "Cut", icon: Scissors, shortcut: "⌘ X" },
      { kind: "item", label: "Copy", icon: Copy, shortcut: "⌘ C" },
      { kind: "item", label: "Paste", icon: ClipboardPaste, shortcut: "⌘ V" },
      { kind: "sep" },
      { kind: "item", label: "Find", icon: Search, shortcut: "⌘ F" },
    ],
    View: [
      {
        kind: "item",
        label: showExplorer ? "Hide Explorer" : "Show Explorer",
        icon: showExplorer ? EyeOff : Eye,
        shortcut: "⌘ B",
        onClick: onToggleExplorer,
      },
      {
        kind: "item",
        label: showConsole ? "Hide Console" : "Show Console",
        icon: Terminal,
        shortcut: "⌘ J",
        onClick: onToggleConsole,
      },
      {
        kind: "item",
        label: showAI ? "Hide Nebula AI" : "Show Nebula AI",
        icon: Sparkles,
        shortcut: "⌘ L",
        onClick: onToggleAI,
      },
      { kind: "sep" },
      {
        kind: "item",
        label: theme === "dark" ? "Light Theme" : "Dark Theme",
        icon: theme === "dark" ? Sun : Moon,
        shortcut: "⌘ ⇧ T",
        onClick: onToggleTheme,
      },
      {
        kind: "item",
        label: "Toggle Sidebar",
        icon: PanelLeft,
      },
    ],
    Go: [
      { kind: "item", label: "Go to File…", icon: ArrowRight, shortcut: "⌘ P" },
      { kind: "item", label: "Go to Symbol…", shortcut: "⌘ ⇧ O" },
      { kind: "item", label: "Go to Line…", shortcut: "⌘ G" },
    ],
    Run: [
      {
        kind: "item",
        label: "Run File",
        icon: Play,
        shortcut: "⌘ ⏎",
        onClick: onRun,
      },
      { kind: "item", label: "Debug", icon: Bug, shortcut: "F5" },
      { kind: "item", label: "Stop", icon: Zap },
    ],
    Help: [
      {
        kind: "item",
        label: "Keyboard Shortcuts",
        icon: Keyboard,
        shortcut: "⌘ K",
        onClick: onShortcuts,
      },
      { kind: "item", label: "Documentation", icon: HelpCircle },
      { kind: "item", label: "About Nebula", icon: Info },
    ],
  };

  return (
    <div
      ref={wrapRef}
      className="flex items-center text-[12px] text-[var(--panel-fg)] h-11 select-none glass-soft relative z-30"
      style={{
        background: "var(--titlebar-bg)",
        borderBottom: "1px solid var(--border)",
      }}
    >
      <div className="flex items-center gap-2 px-3">
        <span className="traffic-dot" style={{ background: "#ff5f57" }} />
        <span className="traffic-dot" style={{ background: "#febc2e" }} />
        <span className="traffic-dot" style={{ background: "#28c840" }} />
      </div>
      <div className="flex items-center gap-2 pl-2 pr-3">
        <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-violet-500 via-fuchsia-500 to-sky-400 flex items-center justify-center shadow-lg shadow-violet-500/30">
          <Sparkles size={12} className="text-white" />
        </div>
        <span className="text-[13px] tracking-tight">Nebula Code</span>
      </div>
      <div className="flex items-center">
        {Object.keys(menus).map((m) => {
          const open = openMenu === m;
          return (
            <div key={m} className="relative">
              <button
                onClick={() => setOpenMenu(open ? null : m)}
                onMouseEnter={() => openMenu && setOpenMenu(m)}
                className={`px-2.5 py-1 rounded-full transition-colors ${
                  open
                    ? "bg-white/10 text-[var(--panel-fg)]"
                    : "text-[var(--muted-fg)] hover:bg-[var(--hover-bg)] hover:text-[var(--panel-fg)]"
                }`}
              >
                {m}
              </button>
              {open && (
                <Dropdown
                  items={menus[m]}
                  onClose={() => setOpenMenu(null)}
                />
              )}
            </div>
          );
        })}
      </div>
      <div className="flex-1 flex justify-center px-4">
        <div
          className="flex items-center gap-2 rounded-full px-4 py-1.5 text-[12px] text-[var(--muted-fg)] w-full max-w-md"
          style={{
            background: "rgba(255,255,255,0.06)",
            border: "1px solid var(--border)",
            backdropFilter: "blur(12px)",
          }}
        >
          <Search size={12} />
          <span>Search files, commands, or symbols</span>
          <kbd className="ml-auto mono text-[10px] px-1.5 py-0.5 rounded-md bg-white/10 border border-white/10">
            ⌘P
          </kbd>
        </div>
      </div>
      <div className="flex items-center gap-1 pr-3">
        <IconBtn title="Run" onClick={onRun}>
          <Play size={14} className="text-emerald-400" />
        </IconBtn>
        <IconBtn title="Toggle Explorer" active={showExplorer} onClick={onToggleExplorer}>
          <Files size={14} />
        </IconBtn>
        <IconBtn title="Toggle Console" active={showConsole} onClick={onToggleConsole}>
          <Bug size={14} />
        </IconBtn>
        <IconBtn title="Toggle AI" active={showAI} onClick={onToggleAI}>
          <Sparkles size={14} />
        </IconBtn>
        <IconBtn title="Source Control">
          <GitBranch size={14} />
        </IconBtn>
        <IconBtn title="Shortcuts" onClick={onShortcuts}>
          <Keyboard size={14} />
        </IconBtn>
        <IconBtn title="Toggle Theme" onClick={onToggleTheme}>
          {theme === "dark" ? <Sun size={14} /> : <Moon size={14} />}
        </IconBtn>
        <IconBtn title="Settings" onClick={onOpenSettings}>
          <Settings size={14} />
        </IconBtn>
      </div>
    </div>
  );
}

function Dropdown({
  items,
  onClose,
}: {
  items: MenuItem[];
  onClose: () => void;
}) {
  return (
    <div
      className="absolute top-full left-0 mt-1.5 min-w-[240px] glass rounded-2xl py-1.5 z-50 animate-in fade-in"
      style={{ animationDuration: "120ms" }}
    >
      {items.map((it, i) => {
        if (it.kind === "sep")
          return (
            <div key={i} className="my-1 mx-2 border-t border-[var(--border)]" />
          );
        const Icon = it.icon;
        return (
          <button
            key={i}
            onClick={() => {
              it.onClick?.();
              onClose();
            }}
            className="w-full flex items-center gap-2.5 px-3 py-1.5 mx-1 my-px rounded-xl text-[12.5px] text-[var(--panel-fg)] hover:bg-white/10 transition-colors"
            style={{ width: "calc(100% - 8px)" }}
          >
            {Icon ? (
              <Icon size={13} className="text-[var(--muted-fg)] shrink-0" />
            ) : (
              <span className="w-[13px]" />
            )}
            <span className="flex-1 text-left">{it.label}</span>
            {it.shortcut && (
              <kbd className="mono text-[10.5px] px-1.5 py-0.5 rounded-md bg-white/8 text-[var(--muted-fg)] border border-white/10">
                {it.shortcut}
              </kbd>
            )}
          </button>
        );
      })}
    </div>
  );
}

function IconBtn({
  children,
  title,
  active,
  onClick,
}: {
  children: React.ReactNode;
  title: string;
  active?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      title={title}
      onClick={onClick}
      className={`p-1.5 rounded-full hover:bg-[var(--hover-bg)] transition-colors ${
        active ? "text-sky-400" : "text-[var(--muted-fg)]"
      }`}
    >
      {children}
    </button>
  );
}
