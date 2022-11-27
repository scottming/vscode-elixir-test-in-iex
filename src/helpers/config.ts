import { workspace, Terminal } from 'vscode';

export function config() {
  return workspace.getConfiguration('vscode-elixir-test-in-iex');
}

export default function showTerminal(terminal: Terminal) {
  if (config().get('focusOnTerminalAfterTest')) {
    terminal.show();
  } else {
    terminal.show(true);
  }
}
