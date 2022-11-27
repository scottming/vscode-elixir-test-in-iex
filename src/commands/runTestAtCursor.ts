import { window, ExtensionContext } from 'vscode';
import { startIExAndRunTest } from './runTestFile';

export default async function handler(context: ExtensionContext) {
  const activeFile = window.activeTextEditor;
  if (!activeFile) {
    return;
  }
  const line = activeFile.selection.active.line + 1;
  await startIExAndRunTest(context, activeFile.document.fileName, line);
}
