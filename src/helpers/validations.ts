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

const DEFAULT_START_TEXT =
  'MIX_ENV=test iex --no-pry -S mix run -e ' +
  `'Code.eval_file("~/.test_iex/lib/test_iex.ex");TestIex.start()'`;

export function populateStartText(
  openedFileName: string | undefined,
  cwdFun: () => string = getCWD,
  defaultStartText: string = DEFAULT_START_TEXT
): string {
  if (!openedFileName) {
    return defaultStartText;
  }

  if (isUmbrella(openedFileName)) {
    const targetCWD = targetWorkingDir(openedFileName);
    const cwd = cwdFun();
    return cwd !== targetCWD ? `cd ${targetCWD} && ` + defaultStartText : defaultStartText;
  } else {
    return defaultStartText;
  }
}

function getCWD(): string {
  return workspace.workspaceFolders
    ? workspace.workspaceFolders.map((f) => f.uri.fsPath)[0]
    : process.cwd();
}
