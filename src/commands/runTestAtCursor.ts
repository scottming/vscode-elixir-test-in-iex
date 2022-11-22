import { window, ExtensionContext } from "vscode";
import { isTestFile } from "../helpers/validations";
import StateManager from "../helpers/lastCommandManager";
import iexConfig from "../helpers/config";

export default async function handler(context: ExtensionContext) {
  const activeFile = window.activeTextEditor;
  if (!activeFile) {
    return;
  }
  const config = iexConfig();
  const terminal = window.activeTerminal || window.createTerminal();

  const state = new StateManager(context); // cache the command
  const openedFilename: string = activeFile.document.fileName;

  if (isTestFile(openedFilename)) {
    let matched = openedFilename.match(/.*\/(test\/.*)$/);
    if (matched) {
      const cursorLine = activeFile.selection.active.line + 1;
      const command = `TestIex.test("${matched[1]}", ${cursorLine})`;
      terminal.sendText(command);
      await state.write({ lastCommand: command });
    }
    config.focusOnTerminalAfterTest && terminal.show();
  } else {
    const { lastCommand } = state.read();

    if (lastCommand) {
      terminal.sendText(lastCommand);
    } else {
      window.showInformationMessage("The current file is not a test file.");
    }
  }
}