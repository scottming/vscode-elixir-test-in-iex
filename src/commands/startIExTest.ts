import { window, workspace, Terminal } from 'vscode';
import getConfig from '../helpers/config';
import { isUmbrella, targetWorkingDir } from '../helpers/validations';

export default function handler(terminal: Terminal | null = null) {
  let activateTerminal: Terminal;
  if (!terminal) {
    activateTerminal = window.activeTerminal || window.createTerminal();
  } else {
    activateTerminal = terminal;
  }

  const defaultStartText = `MIX_ENV=test iex --no-pry -S mix run -e 'Code.eval_file("~/.test_iex/lib/test_iex.ex");TestIex.start()'`;
  const openedFileName = window.activeTextEditor?.document.fileName;
  if (!openedFileName) {
    return startIExWith(activateTerminal, defaultStartText);
  }

  const startText: string = populateStartText(defaultStartText, openedFileName, getCWD);
  return startIExWith(activateTerminal, startText);
}

function startIExWith(terminal: Terminal, text: string) {
  terminal.sendText(text);
  getConfig() && terminal.show();
}

export function populateStartText(
  defaultStartText: string,
  openedFileName: string,
  cwdFun: () => string
): string {
  if (isUmbrella(openedFileName)) {
    const targetCWD = targetWorkingDir(openedFileName);
    const cwd = cwdFun();
    return cwd !== targetCWD ? `cd ${targetCWD} && ` + defaultStartText : defaultStartText;
  } else {
    return defaultStartText;
  }
}

function getCWD(): string {
  return workspace.workspaceFolders
    ? workspace.workspaceFolders.map((f) => f.uri.fsPath)[0]
    : process.cwd();
}
