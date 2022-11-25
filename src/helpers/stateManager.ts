import { Terminal } from 'vscode';
import { ExtensionContext, window } from 'vscode';
import * as O from 'fp-ts/Option';
import { pipe } from 'fp-ts/function';

type State = {
  lastCommand: string;
  lastStartCommand: string;
};

export default class StateManager {
  context: ExtensionContext;

  constructor(context: ExtensionContext) {
    this.context = context;
  }

  getLastCommand(): State['lastCommand'] | undefined {
    return this.context.globalState.get('lastCommand');
  }

  getLastStartCommand(): State['lastStartCommand'] | undefined {
    return this.context.globalState.get('lastStartCommand');
  }

  async setLastCommand(newCommand: State[keyof State]) {
    await this.set('lastCommand', newCommand);
  }

  async setLastStartCommand(newCommand: State[keyof State]) {
    await this.set('lastStartCommand', newCommand);
  }

  private async set(key: keyof State, newCommand: State[keyof State]) {
    await this.context.globalState.update(key, newCommand);
  }
}

export function sendLastCommandWith(context: ExtensionContext, terminal: Terminal) {
  const state = new StateManager(context);

  return pipe(
    state.getLastCommand(),
    O.fromNullable,
    O.matchW(
      () => window.showInformationMessage('The current file is not a test file.'),
      (command: string) => terminal.sendText(command)
    )
  );
}
