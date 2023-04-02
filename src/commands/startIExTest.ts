import StateManager from '../helpers/stateManager';
import { window, Terminal, ExtensionContext } from 'vscode';
import showTerminal from '../helpers/config';
import { populateStartText } from '../helpers/validations';

export const TERMINAL_NAME = 'TestInIEx';

export default function handler(context: ExtensionContext) {
  const { terminals, createTerminal } = window;
  const terminal =
    terminals.find((terminal) => terminal.name === TERMINAL_NAME) || createTerminal(TERMINAL_NAME);
  window.activeTerminal || window.createTerminal();
  const openedFileName = window.activeTextEditor?.document.fileName;
  const startText: string = populateStartText(openedFileName, context.extensionPath);
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
