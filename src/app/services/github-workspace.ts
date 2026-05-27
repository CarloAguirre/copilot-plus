import type { FileNode } from "../components/editor-types";

export type GitHubRepository = {
  owner: string;
  repo: string;
  branch: string;
};

type GitHubContentItem = {
  name: string;
  path: string;
  type: "file" | "dir";
  sha: string;
  size?: number;
  download_url?: string | null;
};

const languageByName = (name: string) => {
  if (name.endsWith(".tsx")) return "tsx";
  if (name.endsWith(".ts")) return "ts";
  if (name.endsWith(".jsx")) return "jsx";
  if (name.endsWith(".js")) return "js";
  if (name.endsWith(".json")) return "json";
  if (name.endsWith(".md")) return "md";
  if (name.endsWith(".py")) return "py";
  if (name.endsWith(".css")) return "css";
  if (name.endsWith(".html")) return "html";
  if (name.endsWith(".yml") || name.endsWith(".yaml")) return "yaml";
  return "txt";
};

const contentUrl = (repository: GitHubRepository, path = "") => {
  const base = `https://api.github.com/repos/${repository.owner}/${repository.repo}/contents`;
  const normalized = path ? `/${path}` : "";
  return `${base}${normalized}?ref=${repository.branch}`;
};

export async function fetchRepositoryTree(
  repository: GitHubRepository,
  path = "",
): Promise<FileNode[]> {
  const response = await fetch(contentUrl(repository, path));
  if (!response.ok) {
    throw new Error(`GitHub sync failed: ${response.status} ${response.statusText}`);
  }

  const items = (await response.json()) as GitHubContentItem[];
  const nodes = await Promise.all(
    items.map(async (item): Promise<FileNode> => {
      if (item.type === "dir") {
        return {
          id: item.path,
          path: item.path,
          name: item.name,
          type: "folder",
          sha: item.sha,
          children: await fetchRepositoryTree(repository, item.path),
        };
      }

      return {
        id: item.path,
        path: item.path,
        name: item.name,
        type: "file",
        sha: item.sha,
        size: item.size,
        downloadUrl: item.download_url ?? undefined,
        language: languageByName(item.name),
      };
    }),
  );

  return nodes.sort((a, b) => {
    if (a.type !== b.type) return a.type === "folder" ? -1 : 1;
    return a.name.localeCompare(b.name);
  });
}

export async function fetchFileContent(node: FileNode) {
  if (!node.downloadUrl) return node.content ?? "";
  const response = await fetch(node.downloadUrl);
  if (!response.ok) {
    throw new Error(`File download failed: ${response.status} ${response.statusText}`);
  }
  return response.text();
}
