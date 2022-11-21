import { window, workspace } from "vscode";
import { isTestFile } from "../helpers/validations";
import stateManager from "../helpers/lastCommandManager";

export default async function handler() {
  const activeFile = window.activeTextEditor;
  if (!activeFile) {
    return;
  }

  const openedFilename: string = activeFile.document.fileName;
  const isATestFile: boolean = isTestFile(openedFilename);

  const config = workspace.getConfiguration("vscode-elixir-test");

  const terminal = window.activeTerminal || window.createTerminal();
  if (isATestFile === true) {
    let matched = openedFilename.match(/.*\/(test\/.*)$/);
    if (matched) {
      let command = `TestIex.test("${matched[1]}")`;
      matched && terminal.sendText(command);
      if (config.focusOnTerminalAfterTest) terminal.show();
    }
  } else {
    console.log("terminal state", terminal.state);
    window.showInformationMessage("The current file is not a test file.");
  }
}
