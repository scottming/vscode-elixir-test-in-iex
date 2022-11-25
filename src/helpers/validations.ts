const isFolder = (openedFilename: string, folderName: string) => {
  return openedFilename.includes(`${folderName}`);
};

export function isTestFile(openedFilename: string) {
  return openedFilename.includes("_test.exs");
}

export function isTestFolder(openedFilename: string) {
  return isFolder(openedFilename, "test");
}

export function isUmbrella(openedFilename: string) {
  return isFolder(openedFilename, "apps");
}

export function targetWorkingDir(openedFilename: string): string | null {
  let r = /(.*)\/(apps\/\w+).*$/;
  let targetWorkingDirMathced = openedFilename.match(r);
  return (
    targetWorkingDirMathced &&
    targetWorkingDirMathced[1] + "/" + targetWorkingDirMathced[2]
  );
}
