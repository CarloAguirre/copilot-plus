import { useState } from "react";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { MenuBar } from "./components/menu-bar";
import { ActivityBar } from "./components/activity-bar";
import { FileExplorer } from "./components/file-explorer";
import { EditorTabs } from "./components/editor-tabs";
import { CodeEditor } from "./components/code-editor";
import { AIChat } from "./components/ai-chat";
import { OutputConsole } from "./components/output-console";
import { LiquidDock } from "./components/liquid-dock";
import { Breadcrumb } from "./components/breadcrumb";
import { Minimap } from "./components/minimap";
import { AIHint } from "./components/ai-hint";
import type { FileNode, LogLine, Tab } from "./components/editor-types";
import { initialTree } from "./components/mock-data";

const now = () => new Date().toLocaleTimeString("en-US", { hour12: false });

export default function WorkspaceApp() {
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [panel, setPanel] = useState("explorer");
  const [tree] = useState<FileNode[]>(initialTree);
  const [tabs, setTabs] = useState<Tab[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [logs, setLogs] = useState<LogLine[]>([{ id: "init", type: "info", text: "Copilot Plus workspace ready", time: now() }]);
  const activeTab = tabs.find((t) => t.id === activeId) ?? null;

  const openFile = (node: FileNode) => {
    if (node.type !== "file") return;
    setActiveId(node.id);
    setTabs((prev) => prev.some((t) => t.id === node.id) ? prev : [...prev, { id: node.id, name: node.name, language: node.language ?? "txt", content: node.content ?? "" }]);
  };

  const closeTab = (id: string) => {
    setTabs((prev) => prev.filter((t) => t.id !== id));
    if (activeId === id) setActiveId(null);
  };

  const updateContent = (content: string) => {
    if (!activeId) return;
    setTabs((prev) => prev.map((t) => t.id === activeId ? { ...t, content, dirty: true } : t));
  };

  const runCode = () => setLogs((l) => [...l, { id: crypto.randomUUID(), type: "info", text: activeTab ? `${activeTab.name} staged locally` : "No file open", time: now() }]);

  return (
    <div className={`nebula-root nebula-bg ${theme === "dark" ? "nebula-theme-dark" : "nebula-theme-light"} size-full flex flex-col text-[var(--panel-fg)]`}>
      <MenuBar theme={theme} onToggleTheme={() => setTheme((t) => t === "dark" ? "light" : "dark")} onShortcuts={() => {}} showExplorer showAI showConsole onToggleExplorer={() => {}} onToggleAI={() => {}} onToggleConsole={() => {}} onRun={runCode} onOpenSettings={() => {}} />
      <div className="flex-1 min-h-0 p-3 flex gap-2">
        <ActivityBar active={panel} onChange={setPanel} onOpenSettings={() => {}} />
        <PanelGroup direction="horizontal">
          <Panel id="explorer" order={1} defaultSize={18} minSize={12} maxSize={35}><FileExplorer tree={tree} activeId={activeId} onOpen={openFile} onMove={() => {}} /></Panel>
          <PanelResizeHandle className="w-2 hover:bg-sky-400/30 transition-colors" />
          <Panel id="main" order={2} defaultSize={56} minSize={30}>
            <PanelGroup direction="vertical">
              <Panel id="editor" order={1} defaultSize={70} minSize={20}>
                <div className="h-full flex flex-col glass rounded-3xl overflow-hidden relative"><EditorTabs tabs={tabs} activeId={activeId} onSelect={setActiveId} onClose={closeTab} /><Breadcrumb tab={activeTab} /><div className="flex-1 min-h-0 flex"><div className="flex-1 min-w-0"><CodeEditor tab={activeTab} onChange={updateContent} /></div><Minimap tab={activeTab} /></div><AIHint tab={activeTab} /></div>
              </Panel>
              <PanelResizeHandle className="h-2 hover:bg-sky-400/30 transition-colors" />
              <Panel id="console" order={2} defaultSize={30} minSize={10}><OutputConsole logs={logs} onClear={() => setLogs([])} onRun={runCode} /></Panel>
            </PanelGroup>
          </Panel>
          <PanelResizeHandle className="w-2 hover:bg-sky-400/30 transition-colors" />
          <Panel id="ai" order={3} defaultSize={26} minSize={18} maxSize={45}><AIChat activeTab={activeTab} /></Panel>
        </PanelGroup>
      </div>
      <LiquidDock activeTab={activeTab} errors={0} warnings={0} />
    </div>
  );
}
