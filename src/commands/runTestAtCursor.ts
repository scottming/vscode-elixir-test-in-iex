import { window, ExtensionContext } from 'vscode';
import { runTest } from './runTestFile';

export default async function handler(context: ExtensionContext) {
  const activeFile = window.activeTextEditor;
  if (!activeFile) {
    return;
  }
  const line = activeFile.selection.active.line + 1;
  await runTest(context, activeFile, line);
}
