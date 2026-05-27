import { GitBranch, Bell, AlertCircle, AlertTriangle, Wifi } from "lucide-react";
import type { Tab } from "./editor-types";

type Props = {
  activeTab: Tab | null;
  errors: number;
  warnings: number;
};

export function StatusBar({ activeTab, errors, warnings }: Props) {
  const lines = activeTab?.content.split("\n").length ?? 0;
  return (
    <div className="flex items-center bg-blue-600 text-white text-[11px] h-6 px-3 gap-3 select-none">
      <div className="flex items-center gap-1">
        <GitBranch size={11} />
        <span>main</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="flex items-center gap-1">
          <AlertCircle size={11} /> {errors}
        </span>
        <span className="flex items-center gap-1">
          <AlertTriangle size={11} /> {warnings}
        </span>
      </div>
      <div className="ml-auto flex items-center gap-3">
        {activeTab && (
          <>
            <span>{lines} lines</span>
            <span>{activeTab.language.toUpperCase()}</span>
            <span>UTF-8</span>
            <span>LF</span>
            <span>Spaces: 2</span>
          </>
        )}
        <Wifi size={11} />
        <Bell size={11} />
      </div>
    </div>
  );
}
