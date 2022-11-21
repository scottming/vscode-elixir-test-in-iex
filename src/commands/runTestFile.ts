import { window, workspace } from "vscode";
import { isTestFile } from "../helpers/validations";

export default function handler() {
  const activeFile = window.activeTextEditor;
  if (!activeFile) {
    return;
  }

  const openedFilename: string = activeFile.document.fileName;
  const isATestFile: boolean = isTestFile(openedFilename);

  const config = workspace.getConfiguration("vscode-elixir-test");

  if (isATestFile === true) {
    const terminal = window.activeTerminal || window.createTerminal();
    let matched = openedFilename.match(/.*\/(test\/.*)$/);
    matched && terminal.sendText(`TestIex.test("${matched[1]}")`);
    if (config.focusOnTerminalAfterTest) terminal.show();
  } else {
    window.showInformationMessage("The current file is not a test file.");
  }
}
