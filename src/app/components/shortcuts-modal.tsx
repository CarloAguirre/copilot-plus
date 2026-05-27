import { X } from "lucide-react";

const shortcuts = [
  { keys: ["Ctrl", "S"], action: "Save current file" },
  { keys: ["Ctrl", "W"], action: "Close active tab" },
  { keys: ["Ctrl", "B"], action: "Toggle file explorer" },
  { keys: ["Ctrl", "J"], action: "Toggle output console" },
  { keys: ["Ctrl", "L"], action: "Toggle AI panel" },
  { keys: ["Ctrl", "/"], action: "Focus AI chat" },
  { keys: ["Ctrl", "K"], action: "Show shortcuts" },
  { keys: ["Ctrl", "Shift", "T"], action: "Toggle theme" },
  { keys: ["Ctrl", "Enter"], action: "Run code (mock)" },
  { keys: ["Tab"], action: "Indent in editor" },
];

export function ShortcutsModal({ onClose }: { onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md bg-[var(--panel-bg)] border border-[var(--border)] rounded-lg shadow-2xl"
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--border)]">
          <div className="text-[var(--panel-fg)]">Keyboard Shortcuts</div>
          <button
            onClick={onClose}
            className="p-1 rounded hover:bg-[var(--hover-bg)] text-[var(--muted-fg)]"
          >
            <X size={16} />
          </button>
        </div>
        <div className="p-4 space-y-2">
          {shortcuts.map((s) => (
            <div
              key={s.action}
              className="flex items-center justify-between text-[13px] text-[var(--panel-fg)]"
            >
              <span>{s.action}</span>
              <div className="flex gap-1">
                {s.keys.map((k) => (
                  <kbd
                    key={k}
                    className="px-2 py-0.5 rounded bg-[var(--editor-bg)] border border-[var(--border)] text-[11px] font-mono"
                  >
                    {k}
                  </kbd>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
