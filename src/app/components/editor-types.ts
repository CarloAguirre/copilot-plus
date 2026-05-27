export type FileNode = {
  id: string;
  name: string;
  type: "file" | "folder";
  language?: string;
  content?: string;
  children?: FileNode[];
};

export type Tab = {
  id: string;
  name: string;
  language: string;
  content: string;
  dirty?: boolean;
};

export type LogLine = {
  id: string;
  type: "log" | "error" | "warn" | "info" | "success";
  text: string;
  time: string;
};

export type ChatMsg = {
  id: string;
  role: "user" | "ai";
  text: string;
  kind?: "suggestion" | "debug" | "completion" | "text";
};
