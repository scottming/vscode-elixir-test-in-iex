import path = require('path');
import { workspace } from 'vscode';
import { pipe } from 'fp-ts/function';
import * as A from 'fp-ts/lib/Array';
import * as O from 'fp-ts/Option';
import { execSync } from 'child_process';

type CWD = string | null;

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

export function targetWorkingDir(openedFilename: string): CWD {
  let r = /(.*)\/(apps\/\w+).*$/;
  let targetWorkingDirMathced = openedFilename.match(r);
  return targetWorkingDirMathced && targetWorkingDirMathced[1] + '/' + targetWorkingDirMathced[2];
}

function doPopulate(extensionPath: string, cwd: CWD, switchCwd = false) {
  let prefix;

  if (switchCwd) {
    prefix = `cd ${cwd} && `;
  } else {
    prefix = '';
  }

  let command;
  if (smallerThan115(cwd)) {
    command = 'MIX_ENV=test iex --no-pry -S mix run -e ';
  } else {
    command = 'MIX_ENV=test iex -S mix run -e ';
  }

  const iexUnitPath = path.join(extensionPath, 'iex-unit', 'lib', 'iex_unit.ex');
  return prefix + command + `'Code.eval_file("${iexUnitPath}");IExUnit.start()'`;
}

type VersionResult = string | null;
type Version = Array<string>;

// export only for testing
export const smallerThan115 = (cwd: CWD): boolean => {
  const asdfVersion: Version = pipe(cwd, asdfElixirVersion, parseVersionResult);
  const small = (s: string) => s < '1.15';

  return pipe(
    asdfVersion,
    A.lookup(1),
    O.map(small),
    O.getOrElse(() => false)
  );
};

// export only for testing
export const asdfElixirVersion = (cwd: CWD): VersionResult => {
  try {
    let result = null;
    if (cwd) {
      const execReuslt = execSync(`cd ${cwd} && asdf current elixir`);
      result = `${execReuslt}`;
    } else {
      result = `${execSync('asdf current elixir')}`;
    }
    return result;
  } catch {
    return null;
  }
};

const parseVersionResult = (result: VersionResult): Array<string> => {
  if (!result) {
    return [];
  }
  return result.split(' ').filter((x) => x !== '');
};

export function populateStartText(
  openedFileName: string | undefined,
  extensionPath: string,
  cwdFun: () => string = getCWD
): string {
  const cwd = cwdFun();
  const startText = doPopulate(extensionPath, cwd);
  const populateWithSwitchedCWD = (cwd: CWD) => doPopulate(extensionPath, cwd, true);

  if (!openedFileName) {
    return startText;
  }

  if (isUmbrella(openedFileName)) {
    const targetCWD: CWD = targetWorkingDir(openedFileName);
    return cwd !== targetCWD ? populateWithSwitchedCWD(targetCWD) : startText;
  } else {
    return startText;
  }
}

function getCWD(): string {
  return workspace.workspaceFolders
    ? workspace.workspaceFolders.map((f) => f.uri.fsPath)[0]
    : process.cwd();
}
