import { window, ExtensionContext, TextEditor } from 'vscode';
import StateManager, { sendLastCommandWith } from '../helpers/stateManager';
import mayShowTerminal from '../helpers/config';
import { isTestFile } from '../helpers/validations';

const FILE_FILTER = /.*\/(test\/.*)$/;

export default async function handler(context: ExtensionContext) {
  const activeFile = window.activeTextEditor;
  if (!activeFile) {
    return;
  }
  runTest(context, activeFile);
}

export async function runTest(
  context: ExtensionContext,
  activeFile: TextEditor,
  line: number | null = null
) {
  const terminal = window.activeTerminal || window.createTerminal();
  const openedFilename: string = activeFile.document.fileName;
  if (!isTestFile(openedFilename)) {
    sendLastCommandWith(context, terminal);
    mayShowTerminal(terminal);
    return;
  }

  const state = new StateManager(context);
  const matched = openedFilename.match(FILE_FILTER);
  if (matched) {
    const command = line
      ? `TestIex.test("${matched[1]}", ${line})`
      : `TestIex.test("${matched[1]}")`;
    terminal.sendText(command);
    await state.setLastCommand(command);
    mayShowTerminal(terminal);
  }
}
