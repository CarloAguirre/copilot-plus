import { useState } from "react";
import {
  ChevronRight,
  ChevronDown,
  Folder,
  FolderOpen,
  FileCode2,
  FileText,
  FileJson,
  Plus,
  RefreshCw,
} from "lucide-react";
import type { FileNode } from "./editor-types";

function fileIcon(name: string) {
  if (name.endsWith(".json"))
    return <FileJson size={14} className="text-yellow-400 shrink-0" />;
  if (name.endsWith(".md"))
    return <FileText size={14} className="text-blue-300 shrink-0" />;
  if (name.endsWith(".py"))
    return <FileCode2 size={14} className="text-green-400 shrink-0" />;
  if (name.match(/\.(tsx|jsx)$/))
    return <FileCode2 size={14} className="text-cyan-400 shrink-0" />;
  if (name.match(/\.(ts|js)$/))
    return <FileCode2 size={14} className="text-blue-400 shrink-0" />;
  return <FileText size={14} className="text-zinc-400 shrink-0" />;
}

type Props = {
  tree: FileNode[];
  activeId: string | null;
  onOpen: (n: FileNode) => void;
  onMove: (sourceId: string, targetFolderId: string | null) => void;
};

function NodeRow({
  node,
  depth,
  activeId,
  onOpen,
  onMove,
}: {
  node: FileNode;
  depth: number;
  activeId: string | null;
  onOpen: (n: FileNode) => void;
  onMove: (s: string, t: string | null) => void;
}) {
  const [open, setOpen] = useState(true);
  const [dragOver, setDragOver] = useState(false);
  const isFolder = node.type === "folder";

  return (
    <div>
      <div
        draggable
        onDragStart={(e) => {
          e.dataTransfer.setData("text/file-id", node.id);
          e.dataTransfer.effectAllowed = "move";
        }}
        onDragOver={(e) => {
          if (isFolder) {
            e.preventDefault();
            setDragOver(true);
          }
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          const id = e.dataTransfer.getData("text/file-id");
          if (id && isFolder && id !== node.id) onMove(id, node.id);
        }}
        onClick={() => {
          if (isFolder) setOpen(!open);
          else onOpen(node);
        }}
        className={`flex items-center gap-1 px-2 py-[3px] cursor-pointer text-[13px] select-none rounded-sm
          ${activeId === node.id ? "bg-[var(--accent-bg)] text-[var(--accent-fg)]" : "hover:bg-[var(--hover-bg)]"}
          ${dragOver ? "outline outline-1 outline-blue-400" : ""}`}
        style={{ paddingLeft: 8 + depth * 12 }}
      >
        {isFolder ? (
          <>
            {open ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
            {open ? (
              <FolderOpen size={14} className="text-yellow-400" />
            ) : (
              <Folder size={14} className="text-yellow-400" />
            )}
          </>
        ) : (
          <>
            <span className="w-3" />
            {fileIcon(node.name)}
          </>
        )}
        <span className="truncate">{node.name}</span>
      </div>
      {isFolder && open && node.children && (
        <div>
          {node.children.map((c) => (
            <NodeRow
              key={c.id}
              node={c}
              depth={depth + 1}
              activeId={activeId}
              onOpen={onOpen}
              onMove={onMove}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export function FileExplorer({ tree, activeId, onOpen, onMove }: Props) {
  const [rootDragOver, setRootDragOver] = useState(false);
  return (
    <div className="h-full flex flex-col glass text-[var(--panel-fg)] rounded-3xl overflow-hidden">
      <div className="flex items-center justify-between px-3 py-2 text-[11px] uppercase tracking-wider text-[var(--muted-fg)] border-b border-[var(--border)]">
        <span>Explorer</span>
        <div className="flex items-center gap-1">
          <button className="hover:text-[var(--panel-fg)] p-0.5" title="New file">
            <Plus size={13} />
          </button>
          <button className="hover:text-[var(--panel-fg)] p-0.5" title="Refresh">
            <RefreshCw size={13} />
          </button>
        </div>
      </div>
      <div
        className={`flex-1 overflow-y-auto py-1 ${rootDragOver ? "bg-[var(--hover-bg)]" : ""}`}
        onDragOver={(e) => {
          e.preventDefault();
          setRootDragOver(true);
        }}
        onDragLeave={() => setRootDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setRootDragOver(false);
          const id = e.dataTransfer.getData("text/file-id");
          if (id) onMove(id, null);
        }}
      >
        <div className="px-2 py-1 text-[11px] font-medium text-[var(--muted-fg)]">
          NEBULA-CODE
        </div>
        {tree.map((n) => (
          <NodeRow
            key={n.id}
            node={n}
            depth={0}
            activeId={activeId}
            onOpen={onOpen}
            onMove={onMove}
          />
        ))}
      </div>
    </div>
  );
}
