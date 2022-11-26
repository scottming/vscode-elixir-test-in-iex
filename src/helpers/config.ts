import { workspace, Terminal } from 'vscode';

export function config() {
  return workspace.getConfiguration('vscode-elixir-test-in-iex');
}

export default function mayShowTerminal(terminal: Terminal) {
  config().focusOnTerminalAfterTest && terminal.show();
}
