import { useState } from "react";
import { Terminal, Trash2, AlertCircle, Info, CheckCircle2, AlertTriangle, Play } from "lucide-react";
import type { LogLine } from "./editor-types";

type Props = {
  logs: LogLine[];
  onClear: () => void;
  onRun: () => void;
};

const tabs = ["Problems", "Output", "Terminal", "Debug Console"] as const;

export function OutputConsole({ logs, onClear, onRun }: Props) {
  const [tab, setTab] = useState<(typeof tabs)[number]>("Output");

  const errors = logs.filter((l) => l.type === "error");
  const warnings = logs.filter((l) => l.type === "warn");

  return (
    <div className="h-full flex flex-col glass text-[var(--panel-fg)] rounded-3xl overflow-hidden">
      <div className="flex items-center border-b border-[var(--border)] text-[12px]">
        {tabs.map((t) => {
          const active = tab === t;
          const count =
            t === "Problems" ? errors.length + warnings.length : 0;
          return (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-3 py-2 uppercase tracking-wider text-[11px] border-b-2 ${
                active
                  ? "border-blue-400 text-[var(--panel-fg)]"
                  : "border-transparent text-[var(--muted-fg)] hover:text-[var(--panel-fg)]"
              }`}
            >
              {t}
              {count > 0 && (
                <span className="ml-1.5 text-[10px] bg-rose-500/30 text-rose-300 px-1.5 rounded-full">
                  {count}
                </span>
              )}
            </button>
          );
        })}
        <div className="ml-auto flex items-center gap-1 pr-2">
          <button
            onClick={onRun}
            title="Run"
            className="p-1.5 rounded hover:bg-[var(--hover-bg)] text-emerald-400"
          >
            <Play size={13} />
          </button>
          <button
            onClick={onClear}
            title="Clear"
            className="p-1.5 rounded hover:bg-[var(--hover-bg)] text-[var(--muted-fg)]"
          >
            <Trash2 size={13} />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-2 font-mono text-[12px]">
        {tab === "Problems" &&
          (errors.length + warnings.length === 0 ? (
            <div className="text-[var(--muted-fg)] flex items-center gap-2 px-2 py-1">
              <CheckCircle2 size={13} className="text-emerald-400" />
              No problems detected.
            </div>
          ) : (
            [...errors, ...warnings].map((l) => (
              <div
                key={l.id}
                className="flex items-start gap-2 px-2 py-1 hover:bg-[var(--hover-bg)] rounded"
              >
                {l.type === "error" ? (
                  <AlertCircle size={13} className="text-rose-400 mt-0.5 shrink-0" />
                ) : (
                  <AlertTriangle size={13} className="text-amber-400 mt-0.5 shrink-0" />
                )}
                <span className="break-all">{l.text}</span>
              </div>
            ))
          ))}

        {(tab === "Output" || tab === "Debug Console") && (
          <>
            {logs.length === 0 ? (
              <div className="text-[var(--muted-fg)] px-2 py-1">
                No output yet. Click ▶ Run to simulate execution.
              </div>
            ) : (
              logs.map((l) => <LogRow key={l.id} log={l} />)
            )}
          </>
        )}

        {tab === "Terminal" && (
          <div className="px-2 py-1">
            <div className="text-emerald-400">user@nebula:~$ pnpm dev</div>
            <div className="text-[var(--muted-fg)]">
              VITE v5.0.0 ready in 312 ms
            </div>
            <div className="text-[var(--muted-fg)]">
              ➜ Local: http://localhost:5173/
            </div>
            <div className="text-emerald-400 mt-1">
              user@nebula:~$ <span className="animate-pulse">▍</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function LogRow({ log }: { log: LogLine }) {
  const map = {
    log: { Icon: Terminal, cls: "text-[var(--panel-fg)]" },
    info: { Icon: Info, cls: "text-blue-300" },
    error: { Icon: AlertCircle, cls: "text-rose-400" },
    warn: { Icon: AlertTriangle, cls: "text-amber-400" },
    success: { Icon: CheckCircle2, cls: "text-emerald-400" },
  } as const;
  const { Icon, cls } = map[log.type];
  return (
    <div className={`flex items-start gap-2 px-2 py-0.5 ${cls}`}>
      <span className="text-[var(--muted-fg)] shrink-0">{log.time}</span>
      <Icon size={12} className="mt-1 shrink-0" />
      <span className="break-all whitespace-pre-wrap">{log.text}</span>
    </div>
  );
}
