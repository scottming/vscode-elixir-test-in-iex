import { window, workspace } from "vscode";

export default function handler() {
  const config = workspace.getConfiguration("vscode-elixir-test");
  const terminal = window.activeTerminal || window.createTerminal();
  let text = `MIX_ENV=test iex --no-pry -S mix run -e 'Code.eval_file("~/.test_iex/lib/test_iex.ex");TestIex.start()'`;
  terminal.sendText(text);
  if (config.focusOnTerminalAfterTest) terminal.show();
}
