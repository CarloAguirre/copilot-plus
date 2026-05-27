import {
  GitBranch,
  AlertCircle,
  AlertTriangle,
  Wifi,
  Bell,
  Sparkles,
  Cpu,
  Cloud,
} from "lucide-react";
import type { Tab } from "./editor-types";

type Props = {
  activeTab: Tab | null;
  errors: number;
  warnings: number;
};

export function LiquidDock({ activeTab, errors, warnings }: Props) {
  const lines = activeTab?.content.split("\n").length ?? 0;
  return (
    <div className="px-4 pb-3 pt-1 flex justify-center pointer-events-none">
      <div className="liquid-dock pointer-events-auto flex items-center gap-2 px-4 py-2 text-[11.5px] text-[var(--panel-fg)] mono">
        <span
          className="liquid-blob"
          style={{ background: "#a855f7", left: -10, top: -10, width: 60, height: 60 }}
        />
        <span
          className="liquid-blob"
          style={{
            background: "#38bdf8",
            right: -12,
            bottom: -10,
            width: 70,
            height: 70,
            animationDelay: "1.2s",
          }}
        />
        <span
          className="liquid-blob"
          style={{
            background: "#ec4899",
            left: "40%",
            top: -14,
            width: 50,
            height: 50,
            animationDelay: "0.6s",
          }}
        />

        <span className="dock-pill">
          <GitBranch size={11} />
          main
        </span>
        <span className="dock-pill">
          <AlertCircle size={11} className="text-rose-400" />
          {errors}
          <AlertTriangle size={11} className="text-amber-400 ml-1.5" />
          {warnings}
        </span>
        <span className="dock-pill">
          <Sparkles size={11} className="text-violet-300" />
          Nebula AI
        </span>
        {activeTab && (
          <>
            <span className="dock-pill">
              {activeTab.language.toUpperCase()} · {lines} lines
            </span>
            <span className="dock-pill">UTF-8 · LF · 2sp</span>
          </>
        )}
        <span className="dock-pill">
          <Cpu size={11} /> 3%
        </span>
        <span className="dock-pill">
          <Cloud size={11} /> Synced
        </span>
        <span className="dock-pill">
          <Wifi size={11} />
        </span>
        <span className="dock-pill">
          <Bell size={11} />
        </span>
      </div>
    </div>
  );
}
