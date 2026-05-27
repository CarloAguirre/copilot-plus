import type { FileNode } from "./editor-types";

export const initialTree: FileNode[] = [
  {
    id: "root-src",
    name: "src",
    type: "folder",
    children: [
      {
        id: "f-app",
        name: "App.tsx",
        type: "file",
        language: "tsx",
        content: `import { useState } from "react";
import { Sparkles } from "lucide-react";

// Welcome to Nebula Code — an AI powered editor
export default function App() {
  const [count, setCount] = useState(0);

  const handleClick = () => {
    console.log("Button clicked", count);
    setCount(count + 1);
  };

  return (
    <div className="app">
      <h1>Hello, Developer 👋</h1>
      <button onClick={handleClick}>
        Clicked {count} times
      </button>
    </div>
  );
}
`,
      },
      {
        id: "f-utils",
        name: "utils.ts",
        type: "file",
        language: "ts",
        content: `export function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

export const formatDate = (d: Date) =>
  d.toISOString().slice(0, 10);

// TODO: add memoization helper
`,
      },
      {
        id: "folder-comp",
        name: "components",
        type: "folder",
        children: [
          {
            id: "f-button",
            name: "Button.tsx",
            type: "file",
            language: "tsx",
            content: `type Props = { label: string; onClick?: () => void };

export function Button({ label, onClick }: Props) {
  return <button onClick={onClick}>{label}</button>;
}
`,
          },
          {
            id: "f-card",
            name: "Card.tsx",
            type: "file",
            language: "tsx",
            content: `export function Card({ children }: { children: React.ReactNode }) {
  return <div className="card">{children}</div>;
}
`,
          },
        ],
      },
      {
        id: "folder-api",
        name: "api",
        type: "folder",
        children: [
          {
            id: "f-client",
            name: "client.py",
            type: "file",
            language: "py",
            content: `import requests

def fetch_users():
    """Fetch a list of users from the API."""
    response = requests.get("https://api.example.com/users")
    if response.status_code == 200:
        return response.json()
    return []

if __name__ == "__main__":
    print(fetch_users())
`,
          },
        ],
      },
    ],
  },
  {
    id: "f-readme",
    name: "README.md",
    type: "file",
    language: "md",
    content: `# Nebula Code

An AI powered code editor concept.

- Multi-tab editor
- Mock AI assistant
- Resizable IDE layout
`,
  },
  {
    id: "f-pkg",
    name: "package.json",
    type: "file",
    language: "json",
    content: `{
  "name": "nebula-code",
  "version": "1.0.0",
  "scripts": {
    "dev": "vite",
    "build": "vite build"
  }
}
`,
  },
];

export const aiCannedReplies = [
  {
    match: /bug|error|fix|debug/i,
    kind: "debug" as const,
    reply:
      "I noticed a possible issue: you're not handling the loading state. Try wrapping the fetch call in a try/catch and showing a spinner while pending.",
  },
  {
    match: /optim|perf|slow|memo/i,
    kind: "suggestion" as const,
    reply:
      "Consider memoizing the expensive calculation with useMemo, and wrap event handlers in useCallback to avoid unnecessary re-renders.",
  },
  {
    match: /complete|finish|generate|write/i,
    kind: "completion" as const,
    reply:
      "Here's a completion you can drop in:\n\nconst handleSubmit = async (e) => {\n  e.preventDefault();\n  setLoading(true);\n  await save(form);\n  setLoading(false);\n};",
  },
  {
    match: /explain|what|how|why/i,
    kind: "text" as const,
    reply:
      "This component manages local state with useState. Each click increments the counter and triggers a re-render. The handler is recreated each render — fine here, but memoize if you pass it deep.",
  },
];

export const fallbackReply =
  "I can help with code completions, debugging hints, and refactoring suggestions. Try asking 'explain this function' or 'optimize this'.";
