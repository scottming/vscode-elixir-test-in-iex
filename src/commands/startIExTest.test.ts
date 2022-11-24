import { populateStartText } from './startIExTest';

const defaultStartText = 'TestIex.start...';

describe(`populateStartText/3`, () => {
  test('it should not return text that modify the working dir when not umbrella app', () => {
    const openedFileName = '/demo/file_test.exs';
    const cwdFun = () => '/demo';

    const result = populateStartText(defaultStartText, openedFileName, cwdFun);
    expect(result).toMatch(new RegExp(`^${defaultStartText}`));
  });

  test('it should return text that `cd` to working dir when in a umbrella app', () => {
    const childAppPath = '/umbrella_demo/apps/child_app';
    const openedFileName = childAppPath + '/file_test.exs';
    const cwdFun = () => '/umbrella_demo';

    const result = populateStartText(defaultStartText, openedFileName, cwdFun);
    expect(result).toMatch(`cd ${childAppPath} && ${defaultStartText}`);
  });
});
