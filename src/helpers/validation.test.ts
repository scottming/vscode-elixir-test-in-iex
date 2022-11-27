import { populateStartText } from '../helpers/validations';

const DEFAULT_START_TEXT = 'TestIex.start...';

describe(`populateStartText/3`, () => {
  test('it should not return the default start text when not in a umbrella app', () => {
    const openedFileName = '/demo/file_test.exs';
    const cwdFun = () => '/demo';

    const result = populateStartText(openedFileName, cwdFun, DEFAULT_START_TEXT);
    expect(result).toMatch(DEFAULT_START_TEXT);
  });

  test('it should return the default start text when not in a file', () => {
    const openedFileName = undefined;
    const cwdFun = () => '/demo';

    const result = populateStartText(openedFileName, cwdFun, DEFAULT_START_TEXT);
    expect(result).toMatch(DEFAULT_START_TEXT);
  });

  test('it should return text that `cd` to child app dir when in a umbrella app', () => {
    const childAppPath = '/umbrella_demo/apps/child_app';
    const openedFileName = childAppPath + '/file_test.exs';
    const cwdFun = () => '/umbrella_demo';

    const result = populateStartText(openedFileName, cwdFun, DEFAULT_START_TEXT);
    expect(result).toMatch(`cd ${childAppPath} && ${DEFAULT_START_TEXT}`);
  });
});
