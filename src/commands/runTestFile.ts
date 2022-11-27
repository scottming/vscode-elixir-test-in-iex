import { window, ExtensionContext, TextEditor, Terminal } from 'vscode';
import StateManager from '../helpers/stateManager';
import { isTestFile, populateStartText } from '../helpers/validations';
import showTerminal from '../helpers/config';
import { startIExWith } from './startIExTest';

import * as O from 'fp-ts/Option';
import { pipe } from 'fp-ts/function';

const FILE_FILTER = /.*\/(test\/.*)$/;

export default async function handler(context: ExtensionContext) {
  const openedFilename = window.activeTextEditor?.document.fileName;
  if (!openedFilename) {
    return;
  }

  const stateManager = new StateManager(context);
  const startIExText = populateStartText(openedFilename);
  const needsToChange = startCommandNeedsToChange(startIExText, stateManager);

  let terminal: Terminal | undefined = window.activeTerminal;
  if (!terminal || needsToChange) {
    let activeTerminal: Terminal;

    if (!terminal) {
      activeTerminal = window.createTerminal();
      await startIExWith(startIExText, activeTerminal, stateManager);
      await runTest(openedFilename, activeTerminal, stateManager);
    }

    if (needsToChange && terminal) {
      terminal.dispose();
      activeTerminal = window.createTerminal();
      await startIExWith(startIExText, activeTerminal, stateManager);
      await runTest(openedFilename, activeTerminal, stateManager);
    }
  } else {
    await runTest(openedFilename, terminal, stateManager);
  }
}

function startCommandNeedsToChange(startIExText: string, stateManager: StateManager) {
  const lastStartIexCommand = stateManager.getLastStartCommand();
  return lastStartIexCommand !== startIExText;
}

export async function runTest(
  openedFilename: string,
  terminal: Terminal,
  stateManager: StateManager,
  line: number | null = null
) {
  if (!isTestFile(openedFilename)) {
    sendLastCommandWith(terminal, stateManager);
    showTerminal(terminal);
    return;
  }

  const matched = openedFilename.match(FILE_FILTER);
  if (matched) {
    const command = line
      ? `TestIex.test("${matched[1]}", ${line})`
      : `TestIex.test("${matched[1]}")`;
    terminal.sendText(command);
    await stateManager.setLastCommand(command);
    showTerminal(terminal);
  }
}

export function sendLastCommandWith(terminal: Terminal, stateManager: StateManager) {
  return pipe(
    stateManager.getLastCommand(),
    O.fromNullable,
    O.matchW(
      () => window.showInformationMessage('The current file is not a test file.'),
      (command: string) => terminal.sendText(command)
    )
  );
}
