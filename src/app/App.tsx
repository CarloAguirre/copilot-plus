import { useCallback, useEffect, useMemo, useState } from "react";
import {
  PanelGroup,
  Panel,
  PanelResizeHandle,
} from "react-resizable-panels";
import { MenuBar } from "./components/menu-bar";
import { FileExplorer } from "./components/file-explorer";
import { EditorTabs } from "./components/editor-tabs";
import { CodeEditor } from "./components/code-editor";
import { AIChat } from "./components/ai-chat";
import { OutputConsole } from "./components/output-console";
import { LiquidDock } from "./components/liquid-dock";
import { ActivityBar } from "./components/activity-bar";
import { Breadcrumb } from "./components/breadcrumb";
import { Minimap } from "./components/minimap";
import { AIHint } from "./components/ai-hint";
import { ShortcutsModal } from "./components/shortcuts-modal";
import { SettingsModal } from "./components/settings-modal";
import type { FileNode, LogLine, Tab } from "./components/editor-types";
import { initialTree } from "./components/mock-data";

function findNode(tree: FileNode[], id: string): FileNode | null {
  for (const n of tree) {
    if (n.id === id) return n;
    if (n.children) {
      const found = findNode(n.children, id);
      if (found) return found;
    }
  }
  return null;
}

function removeNode(tree: FileNode[], id: string): [FileNode[], FileNode | null] {
  let removed: FileNode | null = null;
  const next = tree
    .map((n): FileNode | null => {
      if (n.id === id) {
        removed = n;
        return null;
      }
      if (n.children) {
        const [c, r] = removeNode(n.children, id);
        if (r) removed = r;
        return { ...n, children: c };
      }
      return n;
    })
    .filter((n): n is FileNode => n !== null);
  return [next, removed];
}

function insertInto(
  tree: FileNode[],
  folderId: string | null,
  node: FileNode,
): FileNode[] {
  if (folderId === null) return [...tree, node];
  return tree.map((n) => {
    if (n.id === folderId && n.type === "folder")
      return { ...n, children: [...(n.children ?? []), node] };
    if (n.children)
      return { ...n, children: insertInto(n.children, folderId, node) };
    return n;
  });
}

const now = () =>
  new Date().toLocaleTimeString("en-US", { hour12: false });

export default function App() {
  const [tree, setTree] = useState<FileNode[]>(initialTree);
  const [tabs, setTabs] = useState<Tab[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [showExplorer, setShowExplorer] = useState(true);
  const [showAI, setShowAI] = useState(true);
  const [showConsole, setShowConsole] = useState(true);
  const [shortcutsOpen, setShortcutsOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [sidebarPanel, setSidebarPanel] = useState("explorer");
  const [logs, setLogs] = useState<LogLine[]>([
    {
      id: "init",
      type: "info",
      text: "Nebula Code v1.0 ready. Welcome 👋",
      time: now(),
    },
  ]);

  const activeTab = useMemo(
    () => tabs.find((t) => t.id === activeId) ?? null,
    [tabs, activeId],
  );

  const openFile = useCallback((node: FileNode) => {
    if (node.type !== "file") return;
    setActiveId(node.id);
    setTabs((prev) => {
      if (prev.find((t) => t.id === node.id)) return prev;
      return [
        ...prev,
        {
          id: node.id,
          name: node.name,
          language: node.language ?? "txt",
          content: node.content ?? "",
        },
      ];
    });
  }, []);

  const closeTab = useCallback(
    (id: string) => {
      setTabs((prev) => {
        const idx = prev.findIndex((t) => t.id === id);
        const next = prev.filter((t) => t.id !== id);
        if (id === activeId) {
          const fallback = next[idx] ?? next[idx - 1] ?? null;
          setActiveId(fallback?.id ?? null);
        }
        return next;
      });
    },
    [activeId],
  );

  const updateContent = useCallback(
    (content: string) => {
      if (!activeId) return;
      setTabs((prev) =>
        prev.map((t) =>
          t.id === activeId ? { ...t, content, dirty: true } : t,
        ),
      );
    },
    [activeId],
  );

  const moveNode = useCallback(
    (sourceId: string, targetFolderId: string | null) => {
      setTree((prev) => {
        const [without, removed] = removeNode(prev, sourceId);
        if (!removed) return prev;
        // prevent dropping a folder into its own descendant
        if (targetFolderId && removed.type === "folder") {
          if (findNode([removed], targetFolderId)) return prev;
        }
        return insertInto(without, targetFolderId, removed);
      });
      setLogs((l) => [
        ...l,
        {
          id: crypto.randomUUID(),
          type: "info",
          text: `Moved item to ${targetFolderId ? "folder" : "root"}`,
          time: now(),
        },
      ]);
    },
    [],
  );

  const runCode = useCallback(() => {
    if (!activeTab) {
      setLogs((l) => [
        ...l,
        {
          id: crypto.randomUUID(),
          type: "warn",
          text: "No file open to run.",
          time: now(),
        },
      ]);
      return;
    }
    const start: LogLine = {
      id: crypto.randomUUID(),
      type: "info",
      text: `▶ Running ${activeTab.name}...`,
      time: now(),
    };
    setLogs((l) => [...l, start]);
    setTimeout(() => {
      const out: LogLine[] = [
        {
          id: crypto.randomUUID(),
          type: "log",
          text: "Compiled successfully in 412ms",
          time: now(),
        },
        {
          id: crypto.randomUUID(),
          type: "log",
          text: '> console.log("Hello, Developer 👋")',
          time: now(),
        },
        {
          id: crypto.randomUUID(),
          type: "success",
          text: "Process exited with code 0",
          time: now(),
        },
      ];
      // 25% chance of a warning to make it feel real
      if (Math.random() < 0.4) {
        out.splice(1, 0, {
          id: crypto.randomUUID(),
          type: "warn",
          text: `${activeTab.name}:12 — 'count' is assigned but only used in render.`,
          time: now(),
        });
      }
      setLogs((l) => [...l, ...out]);
    }, 600);
  }, [activeTab]);

  const toggleTheme = () =>
    setTheme((t) => (t === "dark" ? "light" : "dark"));

  // Keyboard shortcuts
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const ctrl = e.ctrlKey || e.metaKey;
      if (!ctrl) return;
      const k = e.key.toLowerCase();
      if (k === "k") {
        e.preventDefault();
        setShortcutsOpen((s) => !s);
      } else if (k === "b") {
        e.preventDefault();
        setShowExplorer((s) => !s);
      } else if (k === "j") {
        e.preventDefault();
        setShowConsole((s) => !s);
      } else if (k === "l") {
        e.preventDefault();
        setShowAI((s) => !s);
      } else if (k === "s") {
        e.preventDefault();
        if (activeId) {
          setTabs((prev) =>
            prev.map((t) => (t.id === activeId ? { ...t, dirty: false } : t)),
          );
          setLogs((l) => [
            ...l,
            {
              id: crypto.randomUUID(),
              type: "success",
              text: `Saved ${activeTab?.name}`,
              time: now(),
            },
          ]);
        }
      } else if (k === "w") {
        e.preventDefault();
        if (activeId) closeTab(activeId);
      } else if (k === "enter") {
        e.preventDefault();
        runCode();
      } else if (e.shiftKey && k === "t") {
        e.preventDefault();
        toggleTheme();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [activeId, activeTab, closeTab, runCode]);

  // Open the welcome file by default
  useEffect(() => {
    const welcome = findNode(initialTree, "f-app");
    if (welcome) openFile(welcome);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const errors = logs.filter((l) => l.type === "error").length;
  const warnings = logs.filter((l) => l.type === "warn").length;

  return (
    <div
      className={`nebula-root nebula-bg ${
        theme === "dark" ? "nebula-theme-dark" : "nebula-theme-light"
      } size-full flex flex-col text-[var(--panel-fg)]`}
    >
      <MenuBar
        theme={theme}
        onToggleTheme={toggleTheme}
        onShortcuts={() => setShortcutsOpen(true)}
        showExplorer={showExplorer}
        showAI={showAI}
        showConsole={showConsole}
        onToggleExplorer={() => setShowExplorer((s) => !s)}
        onToggleAI={() => setShowAI((s) => !s)}
        onToggleConsole={() => setShowConsole((s) => !s)}
        onRun={runCode}
        onOpenSettings={() => setSettingsOpen(true)}
      />

      <div className="flex-1 min-h-0 p-3 flex gap-2">
        <ActivityBar
          active={sidebarPanel}
          onChange={setSidebarPanel}
          onOpenSettings={() => setSettingsOpen(true)}
        />
        <PanelGroup direction="horizontal">
          {showExplorer && (
            <>
              <Panel id="explorer" order={1} defaultSize={18} minSize={12} maxSize={35}>
                <FileExplorer
                  tree={tree}
                  activeId={activeId}
                  onOpen={openFile}
                  onMove={moveNode}
                />
              </Panel>
              <PanelResizeHandle className="w-2 hover:bg-sky-400/30 transition-colors" />
            </>
          )}

          <Panel
            id="main"
            order={2}
            defaultSize={showExplorer ? (showAI ? 56 : 82) : showAI ? 74 : 100}
            minSize={30}
          >
            <PanelGroup direction="vertical">
              <Panel id="editor" order={1} defaultSize={showConsole ? 70 : 100} minSize={20}>
                <div className="h-full flex flex-col glass rounded-3xl overflow-hidden relative">
                  <EditorTabs
                    tabs={tabs}
                    activeId={activeId}
                    onSelect={setActiveId}
                    onClose={closeTab}
                  />
                  <Breadcrumb tab={activeTab} />
                  <div className="flex-1 min-h-0 flex">
                    <div className="flex-1 min-w-0">
                      <CodeEditor tab={activeTab} onChange={updateContent} />
                    </div>
                    <Minimap tab={activeTab} />
                  </div>
                  <AIHint tab={activeTab} />
                </div>
              </Panel>
              {showConsole && (
                <>
                  <PanelResizeHandle className="h-2 hover:bg-sky-400/30 transition-colors" />
                  <Panel id="console" order={2} defaultSize={30} minSize={10}>
                    <OutputConsole
                      logs={logs}
                      onClear={() => setLogs([])}
                      onRun={runCode}
                    />
                  </Panel>
                </>
              )}
            </PanelGroup>
          </Panel>

          {showAI && (
            <>
              <PanelResizeHandle className="w-2 hover:bg-sky-400/30 transition-colors" />
              <Panel id="ai" order={3} defaultSize={26} minSize={18} maxSize={45}>
                <AIChat activeTab={activeTab} />
              </Panel>
            </>
          )}
        </PanelGroup>
      </div>

      <LiquidDock activeTab={activeTab} errors={errors} warnings={warnings} />

      {shortcutsOpen && (
        <ShortcutsModal onClose={() => setShortcutsOpen(false)} />
      )}
      {settingsOpen && (
        <SettingsModal onClose={() => setSettingsOpen(false)} />
      )}
    </div>
  );
}
