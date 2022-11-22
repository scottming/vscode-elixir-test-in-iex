import { ExtensionContext } from "vscode";

type State = { lastCommand: string | undefined };

export default class StateManager {
  context: ExtensionContext;

  constructor(context: ExtensionContext) {
    this.context = context;
  }

  read(): State {
    return {
      lastCommand: this.context.globalState.get("lastCommand"),
    };
  }

  async write(newState: State) {
    await this.context.globalState.update("lastCommand", newState.lastCommand);
  }
}
