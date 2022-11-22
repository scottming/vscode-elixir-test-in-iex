import { workspace } from "vscode";

export default function config() {
  return workspace.getConfiguration("vscode-elixir-test-in-iex");
}
