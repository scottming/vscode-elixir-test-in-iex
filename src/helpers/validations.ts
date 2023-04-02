import path = require('path');
import { workspace } from 'vscode';

const isFolder = (openedFilename: string, folderName: string) => {
  return openedFilename.includes(`${folderName}`);
};

export function isTestFile(openedFilename: string) {
  return openedFilename.includes('_test.exs');
}

export function isTestFolder(openedFilename: string) {
  return isFolder(openedFilename, 'test');
}

export function isUmbrella(openedFilename: string) {
  return isFolder(openedFilename, 'apps');
}

export function targetWorkingDir(openedFilename: string): string | null {
  let r = /(.*)\/(apps\/\w+).*$/;
  let targetWorkingDirMathced = openedFilename.match(r);
  return targetWorkingDirMathced && targetWorkingDirMathced[1] + '/' + targetWorkingDirMathced[2];
}

function defaultStartText(extensionPath: string) {
  const iexUnitPath = path.join(extensionPath, 'iex-unit', 'lib', 'iex_unit.ex');

  return (
    'MIX_ENV=test iex --no-pry -S mix run -e ' +
    `'Code.eval_file("${iexUnitPath}");IExUnit.start()'`
  );
}

export function populateStartText(
  openedFileName: string | undefined,
  extensionPath: string,
  cwdFun: () => string = getCWD
): string {
  const startText = defaultStartText(extensionPath);

  if (!openedFileName) {
    return startText;
  }

  if (isUmbrella(openedFileName)) {
    const targetCWD = targetWorkingDir(openedFileName);
    const cwd = cwdFun();
    return cwd !== targetCWD ? `cd ${targetCWD} && ` + startText : startText;
  } else {
    return startText;
  }
}

function getCWD(): string {
  return workspace.workspaceFolders
    ? workspace.workspaceFolders.map((f) => f.uri.fsPath)[0]
    : process.cwd();
}
