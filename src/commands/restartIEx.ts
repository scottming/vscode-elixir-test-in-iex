import { window } from "vscode";
import startIExTest from "./startIExTest";

export default function handler() {
  const terminal = window.activeTerminal;
  if (terminal) {
    terminal.dispose();
    startIExTest(window.createTerminal());
  } else {
    startIExTest(window.createTerminal());
  }
}
