import { populateStartText } from '../helpers/validations';

const EXTENSION_PATH = '/home/username/.vscode/extensions/vscode-elixir-test-in-iex/';

describe(`populateStartText/3`, () => {
  test('it should not return the default start text when not in a umbrella app', () => {
    const openedFileName = '/demo/file_test.exs';
    const cwdFun = () => '/demo';

    const result = populateStartText(openedFileName, EXTENSION_PATH, cwdFun);
    expect(result).toMatch(/^MIX_ENV=test/i);
  });

  test('it should return the default start text when not in a file', () => {
    const openedFileName = undefined;
    const cwdFun = () => '/demo';

    const result = populateStartText(openedFileName, EXTENSION_PATH, cwdFun);
    expect(result).toMatch(/^MIX_ENV=test/i);
  });

  test('it should return text that `cd` to child app dir when in a umbrella app', () => {
    const childAppPath = '/umbrella_demo/apps/child_app';
    const openedFileName = childAppPath + '/file_test.exs';
    const cwdFun = () => '/umbrella_demo';

    const result = populateStartText(openedFileName, EXTENSION_PATH, cwdFun);
    expect(result).toMatch(`cd ${childAppPath}`);
  });
});
