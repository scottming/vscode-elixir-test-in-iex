// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import runTestFile from "./commands/runTestFile";
import startIExTest from "./commands/startIExTest";
import runTestAtCursor from "./commands/runTestAtCursor";

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log(
    'Congratulations, your extension "elixir-test-in-iex" is now active!'
  );

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with registerCommand
  // The commandId parameter must match the command field in package.json
  let commands: [string, () => void][] = [
    ["elixir-test-in-iex.runTestFile", runTestFile],
    ["elixir-test-in-iex.startIExTest", startIExTest],
    ["elixir-test-in-iex.runTestAtCursor", runTestAtCursor],
  ];

  for (const [name, command] of commands) {
    let disposable = vscode.commands.registerCommand(name, command);
    context.subscriptions.push(disposable);
  }
}

// This method is called when your extension is deactivated
export function deactivate() {}
