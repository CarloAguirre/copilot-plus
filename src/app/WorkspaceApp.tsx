import { useState } from "react";
import { MenuBar } from "./components/menu-bar";
import { ActivityBar } from "./components/activity-bar";

export default function WorkspaceApp() {
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [panel, setPanel] = useState("explorer");

  return (
    <div className={`nebula-root nebula-bg ${theme === "dark" ? "nebula-theme-dark" : "nebula-theme-light"} size-full flex flex-col text-[var(--panel-fg)]`}>
      <MenuBar
        theme={theme}
        onToggleTheme={() => setTheme((t) => (t === "dark" ? "light" : "dark"))}
        onShortcuts={() => {}}
        showExplorer
        showAI
        showConsole
        onToggleExplorer={() => {}}
        onToggleAI={() => {}}
        onToggleConsole={() => {}}
        onRun={() => {}}
        onOpenSettings={() => {}}
      />
      <div className="flex-1 min-h-0 p-3 flex gap-2">
        <ActivityBar active={panel} onChange={setPanel} onOpenSettings={() => {}} />
        <div className="flex-1 glass rounded-3xl p-6">
          Copilot Plus Workspace · CarloAguirre/crypto_project
        </div>
      </div>
    </div>
  );
}
