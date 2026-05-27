import type { FileNode } from "../components/editor-types";

export type GitHubRepository = {
  owner: string;
  repo: string;
  branch: string;
};

export async function fetchRepositoryTree(_: GitHubRepository): Promise<FileNode[]> {
  return [];
}

export async function fetchFileContent(node: FileNode) {
  return node.content ?? "";
}
