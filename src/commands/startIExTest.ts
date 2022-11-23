import { window, workspace } from "vscode";
import { isUmbrella } from "../helpers/validations";

export default function handler() {
  let defaultStartText = `MIX_ENV=test iex --no-pry -S mix run -e 'Code.eval_file("~/.test_iex/lib/test_iex.ex");TestIex.start()'`;
  const activeFileName = window.activeTextEditor?.document.fileName;
  if (!activeFileName) {
    return startIEx(defaultStartText);
  }

  if (isUmbrella(activeFileName)) {
    const cwd: string = workspace.workspaceFolders
      ? workspace.workspaceFolders.map((f) => f.uri.fsPath)[0]
      : process.cwd();
    let targetCWD = targetWorkingDir(activeFileName);
    return cwd !== targetCWD
      ? startIEx(`cd ${targetCWD} && ` + defaultStartText)
      : startIEx(defaultStartText);
  } else {
    return startIEx(defaultStartText);
  }
}

function startIEx(text: string) {
  const terminal = window.activeTerminal || window.createTerminal();
  terminal.sendText(text);
  const config = workspace.getConfiguration("vscode-elixir-test");
  config.focusOnTerminalAfterTest && terminal.show();
}

function targetWorkingDir(fileName: string): string | null {
  let r = /(.*)\/(apps\/\w+).*$/;
  let targetWorkingDirMathced = fileName.match(r);
  return (
    targetWorkingDirMathced &&
    targetWorkingDirMathced[1] + "/" + targetWorkingDirMathced[2]
  );
}
