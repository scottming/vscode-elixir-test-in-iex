import StateManager from '../helpers/stateManager';
import { window, workspace, Terminal, ExtensionContext } from 'vscode';
import showTerminal from '../helpers/config';
import { populateStartText } from '../helpers/validations';

export default function handler(context: ExtensionContext) {
  const terminal = window.activeTerminal || window.createTerminal();
  const openedFileName = window.activeTextEditor?.document.fileName;
  const startText: string = populateStartText(openedFileName);
  const stateManager = new StateManager(context);
  return startIExWith(startText, terminal, stateManager);
}

/**
 * Start IEx with the given terminal and start text
 * @param terminal
 * @param text
 */
export async function startIExWith(text: string, terminal: Terminal, stateManager: StateManager) {
  terminal.sendText(text);
  await stateManager.setLastStartCommand(text);
  showTerminal(terminal);
}
