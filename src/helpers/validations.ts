const isFolder = (openedFilename: string, folderName: string) => {
  return openedFilename.includes(`\\${folderName}\\`);
};

export function isTestFile(openedFilename: string) {
  return openedFilename.includes("_test.exs");
}

export function isTestFolder(openedFilename: string) {
  return isFolder(openedFilename, "test");
}

export function isCodeFile(openedFilename: string) {
  return openedFilename.match(/(.*\\)(test|lib)(.*\\)(.*)(\.\w+)$/);
}
