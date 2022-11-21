import * as vscode from "vscode";

type State = { lastCommand: string };

export default function stateManager(context: vscode.ExtensionContext) {
  return {
    read,
    write,
  };

  function read() {
    return {
      lastCommand: context.globalState.get("lastCommand"),
    };
  }

  async function write(newState: State) {
    await context.globalState.update("lastCommand", newState.lastCommand);
  }
}
