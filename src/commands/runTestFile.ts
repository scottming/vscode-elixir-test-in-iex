import { window, ExtensionContext, Terminal } from 'vscode';
import StateManager from '../helpers/stateManager';
import { isTestFile, populateStartText } from '../helpers/validations';
import showTerminal from '../helpers/config';
import { startIExWith, TERMINAL_NAME } from './startIExTest';

import * as O from 'fp-ts/Option';
import { pipe } from 'fp-ts/function';

const FILE_FILTER = /.*\/(test\/.*)$/;

export default async function handler(context: ExtensionContext) {
  const openedFilename = window.activeTextEditor?.document.fileName;
  if (!openedFilename) {
    return;
  }
  await startIExAndRunTest(context, openedFilename);
}

export async function startIExAndRunTest(
  context: ExtensionContext,
  openedFilename: string,
  line?: number
) {
  const stateManager = new StateManager(context);
  const startIExText = populateStartText(openedFilename);
  const needsToChange = startCommandNeedsToChange(startIExText, stateManager);

  const { terminals, createTerminal } = window;
  const newTerminalAndRun = async () => {
    const newTerminal = createTerminal(TERMINAL_NAME);
    await startIExWith(startIExText, newTerminal, stateManager);
    await runTest(openedFilename, newTerminal, stateManager, line);
    return;
  };

  let iExTerminal: Terminal | undefined = terminals.find(
    (terminal) => terminal.name === TERMINAL_NAME
  );

  if (iExTerminal && !needsToChange) {
    await runTest(openedFilename, iExTerminal, stateManager, line);
    return;
  }

  if (iExTerminal && needsToChange) {
    iExTerminal.dispose();
    await newTerminalAndRun();
  } else {
    await newTerminalAndRun();
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
  line?: number
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
